"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MonacoEditor from "@/components/MonacoEditor";
import AiResponsePanel from "@/components/AiResponsePanel";
import ModeToggle from "@/components/ModeToggle";
import ProblemInput from "@/components/ProblemInput";
import AuthButton from "@/components/AuthButton";
import SessionTracker from "@/components/SessionTracker";
import { ToastContainer } from "@/components/Toast";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/useToast";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { Mode, ChatMessage } from "@/types";
import Link from "next/link";

type MobilePanel = "editor" | "ai";

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("socratic");
  const [code, setCode] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("editor");
  const [hasInteracted, setHasInteracted] = useState(false);

  const {
    messages,
    isLoading,
    hintCount,
    solvedIndependently,
    concepts,
    sendMessage,
    resetConversation,
  } = useChat();

  const toast = useToast();

  const handleSubmit = useCallback(() => {
    if (!code.trim() && !problemDescription.trim()) {
      toast.error("Please add some code or describe your problem first.");
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: `Code:\n\`\`\`\n${code}\n\`\`\`\n\n${
        problemDescription ? `Problem: ${problemDescription}` : ""
      }`.trim(),
      timestamp: Date.now(),
    };

    sendMessage(userMessage, mode, code);
    setHasInteracted(true);
    // On mobile, switch to AI panel to show the response
    setMobilePanel("ai");
  }, [code, problemDescription, mode, sendMessage, toast]);

  // Keyboard shortcut: Ctrl/Cmd + Enter to submit
  useKeyboardShortcut({
    key: "Enter",
    ctrlKey: true,
    handler: handleSubmit,
  });
  // Also support Cmd+Enter on Mac (metaKey)
  useKeyboardShortcut({
    key: "Enter",
    metaKey: true,
    handler: handleSubmit,
  });

  const handleReset = () => {
    resetConversation();
    setCode("");
    setProblemDescription("");
    setHasInteracted(false);
    toast.info("Conversation cleared.");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-surface flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="text-lg sm:text-xl font-bold text-accent whitespace-nowrap">
            CodeMentor
          </Link>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {messages.length > 0 && (
            <div className="hidden sm:block">
              <SessionTracker
                hintCount={hintCount}
                solvedIndependently={solvedIndependently}
              />
            </div>
          )}
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-accent transition-colors hidden xs:inline"
          >
            Dashboard
          </Link>
          <AuthButton />
        </div>
      </header>

      {/* Mobile tab switcher (only on small screens) */}
      <div className="md:hidden flex border-b border-border bg-surface flex-shrink-0">
        <button
          onClick={() => setMobilePanel("editor")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobilePanel === "editor"
              ? "text-accent border-b-2 border-accent"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          ✏️ Editor
        </button>
        <button
          onClick={() => setMobilePanel("ai")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            mobilePanel === "ai"
              ? "text-accent border-b-2 border-accent"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          🤖 AI
          {messages.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile hint badge */}
      {messages.length > 0 && (
        <div className="md:hidden px-4 py-1.5 border-b border-border bg-surface flex justify-center flex-shrink-0">
          <SessionTracker
            hintCount={hintCount}
            solvedIndependently={solvedIndependently}
          />
        </div>
      )}

      {/* Main content: Editor + AI Panel */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Monaco Editor — hidden on mobile when AI panel active */}
        <div
          className={`${
            mobilePanel === "editor" ? "flex" : "hidden"
          } md:flex flex-col w-full md:w-1/2 border-r border-border`}
        >
          <MonacoEditor code={code} onChange={setCode} />

          {/* Problem description + submit */}
          <div className="p-3 sm:p-4 border-t border-border bg-surface flex-shrink-0">
            <ProblemInput
              value={problemDescription}
              onChange={setProblemDescription}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onReset={handleReset}
            />
            <p className="text-xs text-gray-600 mt-2 hidden sm:block">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-bg border border-border rounded text-xs font-mono">
                Ctrl
              </kbd>{" "}
              +{" "}
              <kbd className="px-1.5 py-0.5 bg-bg border border-border rounded text-xs font-mono">
                Enter
              </kbd>{" "}
              to submit
            </p>
          </div>
        </div>

        {/* Right: AI Response Panel — hidden on mobile when editor active */}
        <div
          className={`${
            mobilePanel === "ai" ? "flex" : "hidden"
          } md:flex flex-col w-full md:w-1/2`}
        >
          <AiResponsePanel
            messages={messages}
            isLoading={isLoading}
            mode={mode}
            onSendMessage={sendMessage}
            concepts={concepts}
          />
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}
