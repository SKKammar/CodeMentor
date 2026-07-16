import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenAI({ apiKey });

/**
 * Stream a response from Gemini.
 * Returns a ReadableStream that yields SSE-formatted text chunks.
 *
 * Uses the classic generateContentStream API: the `contents` array is our
 * conversation history, and `systemInstruction` carries the mode prompt.
 */
export async function streamGeminiResponse(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  // Map our role names to Gemini's (assistant → model)
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await genAI.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        for await (const chunk of stream) {
          // Each chunk is a GenerateContentResponse; extract its text
          const text = chunk.text;
          if (text) {
            const data = JSON.stringify({ type: "token", data: text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown Gemini API error";
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", data: message })}\n\n`
          )
        );
        controller.close();
      }
    },
  });
}

/**
 * Non-streaming helper for structured extraction (e.g. concept tags).
 * Returns the plain text response.
 */
export async function generateGeminiText(
  systemPrompt: string,
  userText: string
): Promise<string> {
  const response = await genAI.models.generateContent({
    model: modelName,
    contents: [{ role: "user", parts: [{ text: userText }] }],
    config: {
      systemInstruction: systemPrompt,
      // Nudge toward JSON-ish output
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  });

  return response.text || "";
}
