import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Auth guard — only authenticated users can save concepts
    const { user, response: authError } = await getAuthenticatedUser();
    if (authError) return authError;

    const body = await request.json();
    const { concepts, connected_concepts } = body;

    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
      return new Response(
        JSON.stringify({ error: "Concepts array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createServerClient();

    // Upsert each concept: increment exposure_count and merge connected_concepts
    for (const concept of concepts) {
      const { data: existing } = await supabase
        .from("concept_graph")
        .select("id, exposure_count, connected_concepts")
        .eq("concept", concept)
        .single();

      if (existing) {
        const merged = Array.from(
          new Set([...(existing.connected_concepts || []), ...(connected_concepts || [])])
        );

        await supabase
          .from("concept_graph")
          .update({
            exposure_count: existing.exposure_count + 1,
            connected_concepts: merged,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("concept_graph").insert({
          concept,
          exposure_count: 1,
          connected_concepts: connected_concepts || [],
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, concepts_upserted: concepts.length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Concepts API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
