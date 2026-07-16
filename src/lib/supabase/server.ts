import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client using the service role key.
 * Bypasses RLS — use ONLY in API routes where you verify auth manually.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Server-side Supabase client that respects RLS.
 * Pass the user's JWT to act as that user.
 */
export function createServerClient(jwt?: string) {
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey, {
    ...(jwt && {
      global: {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    }),
  });
}
