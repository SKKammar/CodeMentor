import { NextRequest } from "next/server";
import { streamGeminiResponse } from "@/lib/gemini";
import { getSystemPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, mode } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!["socratic", "explain", "review"].includes(mode)) {
      return new Response(
        JSON.stringify({ error: "Invalid mode. Must be socratic, explain, or review" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Rate limit: reject conversations longer than 50 messages to prevent abuse
    if (messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Conversation too long. Start a new session." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = getSystemPrompt(mode);
    const geminiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const stream = await streamGeminiResponse(systemPrompt, geminiMessages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
