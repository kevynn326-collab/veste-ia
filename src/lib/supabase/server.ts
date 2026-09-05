import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client — uses the service role key and bypasses RLS.
 * Import only from Route Handlers, Server Actions, or other server-only code.
 */
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
