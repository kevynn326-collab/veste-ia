// Temporary diagnostic route — attempts a real Supabase query and reports
// only the error message (never secret values). Remove once resolved.
export const dynamic = "force-dynamic";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const keyPrefix = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 12) ?? null;
  const keyLength = process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("products").select("id").limit(1);

    return Response.json({
      url,
      keyPrefix,
      keyLength,
      queryError: error?.message ?? null,
      rowCount: data?.length ?? null,
    });
  } catch (err) {
    return Response.json({
      url,
      keyPrefix,
      keyLength,
      thrown: err instanceof Error ? err.message : String(err),
    });
  }
}
