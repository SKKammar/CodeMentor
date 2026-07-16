import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { concepts, connected_concepts } = body;

    if (!concepts || !Array.isArray(concepts) || concepts.length === 0) {
      return new Response(
        JSON.stringify({ error: "Concepts array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const cookieStore = await cookies();
    const token = (await cookieStore.get("sb-access-token"))?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createServerClient(token);

    // Upsert each concept: increment exposure_count and merge connected_concepts
    for (const concept of concepts) {
      // Check if concept already exists
      const { data: existing } = await supabase
        .from("concept_graph")
        .select("id, exposure_count, connected_concepts")
        .eq("concept", concept)
        .single();

      if (existing) {
        // Merge connected concepts (avoid duplicates)
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
