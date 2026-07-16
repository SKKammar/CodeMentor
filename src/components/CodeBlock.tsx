"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a fenced code block with a header bar and a copy-to-clipboard button.
 * The `className` from rehype-highlight carries the language (e.g. "language-js").
 */
export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract language label from className (e.g. "language-typescript" → "typescript")
  const language = className?.replace("language-", "") || "code";

  const handleCopy = async () => {
    const codeEl = containerRef.current?.querySelector("code");
    const text = codeEl?.textContent || "";

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable (e.g. non-HTTPS) — silently ignore
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative group my-3 rounded-lg overflow-hidden border border-border"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-bg border-b border-border">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent transition-colors"
          aria-label="Copy code"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-success"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code content */}
      <pre className="!rounded-none !border-0 !my-0 !mt-0">{children}</pre>
    </div>
  );
}
