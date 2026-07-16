"use client";

import { useState, useCallback, useRef } from "react";
import { ChatMessage, Mode } from "@/types";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  hintCount: number;
  solvedIndependently: boolean;
  concepts: string[];
  sendMessage: (message: ChatMessage, mode: Mode, code?: string) => Promise<void>;
  resetConversation: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [solvedIndependently, setSolvedIndependently] = useState(false);
  const [concepts, setConcepts] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (message: ChatMessage, mode: Mode, code?: string) => {
      setIsLoading(true);
      const userMessages = [...messages, message];
      setMessages(userMessages);

      // Increment hint count for each user message in socratic mode
      if (mode === "socratic") {
        setHintCount((prev) => prev + 1);
      }

      // Prepare Claude messages (role + content only)
      const claudeMessages = userMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: claudeMessages, mode, code }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (buffer.trim()) {
              // process any remaining buffer if needed, though SSE usually ends cleanly
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          const lines = buffer.split("\n");
          // Keep the last partial line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === "token" && event.data) {
                  fullContent += event.data;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: fullContent }
                        : m
                    )
                  );
                } else if (event.type === "error") {
                  throw new Error(event.data || "Stream error");
                }
              } catch {
                // Non-JSON lines (e.g., empty lines between events) — skip
              }
            }
          }
        }

        // Extract concepts via dedicated API call (explain mode only)
        if (mode === "explain") {
          try {
            const extractRes = await fetch("/api/concepts/extract", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: fullContent }),
            });
            if (extractRes.ok) {
              const data = await extractRes.json();
              if (data.concepts?.length > 0) {
                setConcepts(data.concepts);
              }
            }
          } catch {
            // Non-critical — don't block the UX if extraction fails
          }
        }

        // Check if user asked for the answer (socratic solved)
        if (mode === "socratic" && fullContent.length > 0) {
          setSolvedIndependently(true);
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        const errorMessage = (error as Error).message || "Something went wrong";
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== assistantMessage.id),
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `⚠️ Error: ${errorMessage}`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages]
  );

  const resetConversation = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setMessages([]);
    setHintCount(0);
    setSolvedIndependently(false);
    setConcepts([]);
  }, []);

  return {
    messages,
    isLoading,
    hintCount,
    solvedIndependently,
    concepts,
    sendMessage,
    resetConversation,
  };
}
