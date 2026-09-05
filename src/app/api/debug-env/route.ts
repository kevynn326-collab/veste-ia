// Temporary diagnostic route — reports only whether each required env var is
// present (never the actual value). Remove once the Vercel env var issue is
// confirmed fixed.
export async function GET() {
  return Response.json({
    ANTHROPIC_API_KEY: Boolean(process.env.ANTHROPIC_API_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });
}
