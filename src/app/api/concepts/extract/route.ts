import { NextRequest } from "next/server";
import { generateGeminiText } from "@/lib/gemini";

/**
 * POST /api/concepts/extract
 * Takes a code explanation response and extracts structured concept tags via a
 * dedicated Gemini call. This is more robust than trying to parse JSON from
 * the streamed markdown response.
 *
 * Body: { text: string }
 * Returns: { concepts: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text field is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a code concept tagger. Given a code explanation, extract the key CS concepts discussed.
Return ONLY a JSON array of lowercase concept strings. No explanation, no markdown, just the array.
Example: ["recursion", "hash map", "time complexity", "dynamic programming"]`;

    const raw = await generateGeminiText(systemPrompt, text);

    // Strip any markdown fences Gemini might add despite instructions
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const concepts: string[] = JSON.parse(cleaned);

    return new Response(
      JSON.stringify({ concepts: concepts.filter(Boolean) }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Concept extraction error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to extract concepts" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
