"use client";

import { motion } from "framer-motion";

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakTracker({
  currentStreak,
  longestStreak,
}: StreakTrackerProps) {
  // Show last 14 days as streak cells
  const days = 14;
  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));
    // Active days are the most recent N days (simplified; in reality, query actual session dates)
    const isActive = i >= days - currentStreak;
    return {
      date: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
      isActive,
    };
  });

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Activity Streak</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>
            Current:{" "}
            <span className="text-warning font-bold">{currentStreak}d</span>
          </span>
          <span>
            Longest:{" "}
            <span className="text-warning font-bold">{longestStreak}d</span>
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {cells.map((cell, i) => (
          <motion.div
            key={cell.date}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
          >
            <span className="text-[10px] text-gray-600">{cell.label}</span>
            <div
              className={`w-8 h-8 rounded-md border transition-colors ${
                cell.isActive
                  ? "bg-warning/30 border-warning/50"
                  : "bg-bg border-border"
              }`}
            >
              {cell.isActive && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-warning">🔥</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
