"use client";

import { motion } from "framer-motion";

interface SessionTrackerProps {
  hintCount: number;
  solvedIndependently: boolean;
}

export default function SessionTracker({
  hintCount,
  solvedIndependently,
}: SessionTrackerProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Hint count badge */}
      <motion.div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          borderColor: hintCount <= 2 ? "#3fb950" : hintCount <= 4 ? "#d29922" : "#f85149",
          color: hintCount <= 2 ? "#3fb950" : hintCount <= 4 ? "#d29922" : "#f85149",
          backgroundColor:
            hintCount <= 2
              ? "rgba(63,185,80,0.1)"
              : hintCount <= 4
              ? "rgba(210,153,34,0.1)"
              : "rgba(248,81,73,0.1)",
        }}
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        {hintCount} {hintCount === 1 ? "hint" : "hints"}
      </motion.div>

      {/* Solved badge */}
      {solvedIndependently && (
        <motion.div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Solved independently
        </motion.div>
      )}
    </div>
  );
}
