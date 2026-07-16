import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Auth guard — only authenticated users can save sessions
    const { user, response: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const body = await request.json();
    const { language, problem_description, mode, hint_count, solved_independently, concepts } = body;

    const supabase = createServerClient();

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
