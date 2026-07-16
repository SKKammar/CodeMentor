import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Verifies the Supabase JWT from cookies.
 * Returns the user object if valid, or a 401 response if not.
 * Use this at the top of protected API routes.
 */
export async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const token = (await cookieStore.get("sb-access-token"))?.value;

    if (!token) {
      return {
        user: null,
        response: NextResponse.json(
          { error: "Unauthorized — no session token" },
          { status: 401 }
        ),
      };
    }

    const supabase = createServerClient(token);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        user: null,
        response: NextResponse.json(
          { error: "Unauthorized — invalid or expired session" },
          { status: 401 }
        ),
      };
    }

    return { user, response: null };
  } catch {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Authentication check failed" },
        { status: 401 }
      ),
    };
  }
}
