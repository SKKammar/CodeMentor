"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ChatMessage, Mode } from "@/types";
import ConceptTags from "./ConceptTags";
import CodeBlock from "./CodeBlock";

interface AiResponsePanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  mode: Mode;
  onSendMessage: (message: ChatMessage, mode: Mode) => Promise<void>;
  concepts: string[];
}

export default function AiResponsePanel({
  messages,
  isLoading,
  mode,
  onSendMessage,
  concepts,
}: AiResponsePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [followUp, setFollowUp] = useState("");

  // Auto-scroll to bottom on new messages / streaming tokens
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFollowUp = () => {
    if (!followUp.trim()) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: followUp,
      timestamp: Date.now(),
    };
    onSendMessage(msg, mode);
    setFollowUp("");
  };

  const modeLabels: Record<Mode, string> = {
    socratic: "🧠 Socratic Mode",
    explain: "📖 Explain Mode",
    review: "🔍 Review Mode",
  };

  const emptyMessages: Record<Mode, string> = {
    socratic:
      "Paste your code, describe the problem, and I'll guide you to the solution with targeted questions — no answers given.",
    explain:
      "Paste your code and I'll break it down block by block with line-by-line explanations and concept tags.",
    review:
      "Paste your code and I'll give you a structured review — correctness, complexity, readability, and praise for what you did well.",
  };

  const emptyIcons: Record<Mode, string> = {
    socratic: "🧠",
    explain: "📖",
    review: "🔍",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mode indicator */}
      <div className="px-4 py-2 border-b border-border bg-surface flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-medium text-gray-400">
          {modeLabels[mode]}
        </span>
        {messages.length > 0 && (
          <span className="text-xs text-gray-600">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        )}
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center max-w-sm px-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="text-5xl mb-4"
              >
                {emptyIcons[mode]}
              </motion.div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {emptyMessages[mode]}
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`${
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-accent/10 border border-accent/20 text-gray-200"
                      : "bg-surface border border-border text-gray-300"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          pre: ({ node, ...props }) => (
                            <CodeBlock {...props} />
                          ),
                        }}
                      >
                        {message.content || (isLoading ? "" : "")}
                      </ReactMarkdown>
                      {/* Show typing indicator when streaming a new response */}
                      {message.role === "assistant" &&
                        isLoading &&
                        !message.content && (
                          <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-0.5" />
                        )}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Concept tags */}
      {concepts.length > 0 && (
        <div className="px-4 py-2 border-t border-border bg-surface flex-shrink-0">
          <ConceptTags concepts={concepts} />
        </div>
      )}

      {/* Follow-up input */}
      {messages.length > 0 && !isLoading && (
        <div className="p-3 border-t border-border bg-surface flex-shrink-0">
          <div className="flex gap-2">
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFollowUp()}
              placeholder={
                mode === "socratic"
                  ? "Type your answer or ask for another hint…"
                  : "Ask a follow-up question…"
              }
              className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={handleFollowUp}
              disabled={!followUp.trim()}
              className="px-3 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent/80 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
