"use client";

import { motion } from "framer-motion";
import { Mode } from "@/types";

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const modes: { value: Mode; label: string; description: string }[] = [
  {
    value: "socratic",
    label: "Solve",
    description: "Guided hints to find the fix yourself",
  },
  {
    value: "explain",
    label: "Explain",
    description: "Line-by-line code breakdown",
  },
  {
    value: "review",
    label: "Review",
    description: "Code quality feedback",
  },
];

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-bg rounded-lg p-1 border border-border">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onModeChange(m.value)}
          className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === m.value ? "text-white" : "text-gray-400 hover:text-gray-200"
          }`}
          title={m.description}
        >
          {mode === m.value && (
            <motion.div
              layoutId="activeMode"
              className="absolute inset-0 bg-accent/20 border border-accent rounded-md"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
