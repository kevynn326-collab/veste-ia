import "server-only";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { IntentSchema, type Intent } from "@/types/intent";
import { getAnthropicClient, INTENT_MODEL } from "./client";

const SYSTEM_PROMPT = `Você extrai a intenção de compra de moda de um pedido em linguagem natural, em português do Brasil.

Nunca invente informação que não esteja explícita ou fortemente implícita no texto: campos não mencionados devem ficar null (ou lista vazia para os campos de lista).

- "gender": "male", "female" ou "unisex". Use null se não for possível inferir.
- "occasion": uma palavra ou expressão curta (ex: "casamento", "jantar", "viagem", "entrevista", "primeiro encontro"), ou null.
- "style": tags de estilo mencionadas ou fortemente implícitas, em minúsculas (ex: "casual", "elegante", "streetwear", "esportivo", "formal", "smart casual", "minimalista"). Lista vazia se nenhuma for clara.
- "budget": valor em reais (BRL) como número, sem símbolo de moeda. null se não houver orçamento mencionado.
- "location": cidade ou região mencionada, ou null.
- "preferences": outras preferências explícitas (cores, materiais, marcas evitadas, etc). Lista vazia se nenhuma.`;

export async function extractIntent(rawQuery: string): Promise<Intent> {
  const client = getAnthropicClient();

  const response = await client.messages.parse({
    model: INTENT_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: rawQuery }],
    output_config: { format: zodOutputFormat(IntentSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("extractIntent: model did not return valid structured output");
  }

  return response.parsed_output;
}
