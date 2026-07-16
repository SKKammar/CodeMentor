import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return new Response("Missing code parameter", { status: 400 });
  }

  // The cookie is automatically set by the Supabase client during exchange
  const supabase = createServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error);
    return new Response("Authentication failed", { status: 401 });
  }

  // Redirect back to the app
  return new Response(null, {
    status: 302,
    headers: { Location: `${origin}${next}` },
  });
}
