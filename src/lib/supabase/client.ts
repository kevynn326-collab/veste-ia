import { createClient } from "@supabase/supabase-js";

/**
 * Client-side Supabase client — uses the public anon key.
 * RLS on `products` allows public read; every other table is closed to it.
 */
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
