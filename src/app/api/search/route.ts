import { NextRequest } from "next/server";
import { z } from "zod";
import { composeLooks } from "@/lib/ai/composeLooks";
import { extractIntent } from "@/lib/ai/extractIntent";
import { hydrateLooks } from "@/lib/ai/hydrateLooks";
import { buildShortlist } from "@/lib/catalog/ranking";
import { checkRateLimit } from "@/lib/rateLimit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { IntentSchema } from "@/types/intent";

export const runtime = "nodejs";

const RequestSchema = z.object({
  query: z.string().trim().min(3).max(500),
  // When present, skips LLM#1 (extractIntent) and searches directly with this
  // intent — used by the results page's refine filters, so tweaking budget
  // or style doesn't require re-running extraction on the original sentence.
  intent: IntentSchema.optional(),
});

function encodeEvent(event: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

async function persistSearch(
  rawQuery: string,
  intent: unknown,
  looks: Awaited<ReturnType<typeof hydrateLooks>>,
) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: searchRow, error: searchError } = await supabase
      .from("searches")
      .insert({ raw_query: rawQuery, parsed_intent: intent })
      .select("id")
      .single();

    if (searchError || !searchRow) {
      console.error("[/api/search] failed to persist search:", searchError?.message);
      return;
    }

    if (looks.length > 0) {
      const { error: looksError } = await supabase.from("looks").insert(
        looks.map((look) => ({
          search_id: searchRow.id,
          label: look.label,
          title: look.title,
          reasoning: look.reasoning,
          product_ids: look.products.map((p) => p.id),
          total_price: look.totalPrice,
        })),
      );
      if (looksError) {
        console.error("[/api/search] failed to persist looks:", looksError.message);
      }
    }
  } catch (error) {
    // Persisting is best-effort analytics/history — never fail the request over it.
    console.error("[/api/search] persistSearch threw:", error);
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Muitas buscas em pouco tempo. Tente novamente em instantes." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Consulta inválida." }, { status: 400 });
  }

  const { query, intent: providedIntent } = parsed.data;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let intent = providedIntent;
        if (!intent) {
          controller.enqueue(encodeEvent({ stage: "understanding" }));
          intent = await extractIntent(query);
        }

        controller.enqueue(encodeEvent({ stage: "searching" }));
        const shortlist = await buildShortlist(intent);

        controller.enqueue(encodeEvent({ stage: "composing" }));
        const compositions = shortlist.length > 0 ? await composeLooks(intent, shortlist) : [];
        const looks = hydrateLooks(compositions, shortlist);

        controller.enqueue(encodeEvent({ stage: "done", intent, looks }));

        await persistSearch(query, intent, looks);
      } catch (error) {
        console.error("[/api/search]", error);
        controller.enqueue(
          encodeEvent({
            stage: "error",
            message: "Não foi possível processar sua busca. Tente novamente.",
          }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
