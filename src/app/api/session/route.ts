import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, problem_description, mode, hint_count, solved_independently, concepts } = body;

    // Get user token from cookie (set by Supabase auth)
    const cookieStore = await cookies();
    const token = (await cookieStore.get("sb-access-token"))?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createServerClient(token);

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        language: language || "unknown",
        problem_description: problem_description || "",
        mode,
        hint_count: hint_count || 0,
        solved_independently: solved_independently || false,
        concepts: concepts || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Session insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save session" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Session API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
