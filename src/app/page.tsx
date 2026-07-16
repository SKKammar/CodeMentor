"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MonacoEditor from "@/components/MonacoEditor";
import AiResponsePanel from "@/components/AiResponsePanel";
import ModeToggle from "@/components/ModeToggle";
import ProblemInput from "@/components/ProblemInput";
import AuthButton from "@/components/AuthButton";
import SessionTracker from "@/components/SessionTracker";
import { useChat } from "@/hooks/useChat";
import { Mode, ChatMessage } from "@/types";
import Link from "next/link";

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("socratic");
  const [code, setCode] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const {
    messages,
    isLoading,
    hintCount,
    solvedIndependently,
    concepts,
    sendMessage,
    resetConversation,
  } = useChat();

  const handleSubmit = () => {
    if (!code.trim() && !problemDescription.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: `Code:\n\`\`\`\n${code}\n\`\`\`\n\n${problemDescription ? `Problem: ${problemDescription}` : ""}`.trim(),
      timestamp: Date.now(),
    };

    sendMessage(userMessage, mode, code);
  };

  const handleReset = () => {
    resetConversation();
    setCode("");
    setProblemDescription("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-accent">
            CodeMentor
          </Link>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>

        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <SessionTracker
              hintCount={hintCount}
              solvedIndependently={solvedIndependently}
            />
          )}
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-accent transition-colors"
          >
            Dashboard
          </Link>
          <AuthButton />
        </div>
      </header>

      {/* Main content: Editor + AI Panel */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Monaco Editor */}
        <div className="w-1/2 border-r border-border flex flex-col">
          <MonacoEditor code={code} onChange={setCode} />

          {/* Problem description + submit */}
          <div className="p-4 border-t border-border bg-surface">
            <ProblemInput
              value={problemDescription}
              onChange={setProblemDescription}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Right: AI Response Panel */}
        <div className="w-1/2 flex flex-col">
          <AiResponsePanel
            messages={messages}
            isLoading={isLoading}
            mode={mode}
            onSendMessage={sendMessage}
            concepts={concepts}
          />
        </div>
      </div>
    </div>
  );
}
