import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

/**
 * Stream a response from Claude.
 * Returns a ReadableStream that yields SSE-formatted text chunks.
 */
export async function streamClaudeResponse(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<ReadableStream<Uint8Array>> {
  const stream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  let isFirstEvent = true;

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({
              type: "token",
              data: event.delta.text,
            });
            const sse =
              (isFirstEvent ? "" : "\n") + `data: ${data}\n\n`;
            controller.enqueue(encoder.encode(sse));
            isFirstEvent = false;
          }
        }

        // Send done event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown Claude API error";
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
