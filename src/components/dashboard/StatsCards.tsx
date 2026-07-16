"use client";

import { motion } from "framer-motion";

interface StatsCardsProps {
  totalAttempted: number;
  totalSolved: number;
  solveRate: number;
  currentStreak: number;
  longestStreak: number;
}

const cards = [
  {
    label: "Problems Attempted",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    icon: "📝",
  },
  {
    label: "Solved Independently",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    icon: "✅",
  },
  {
    label: "Solve Rate",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    icon: "🎯",
  },
  {
    label: "Current Streak",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    icon: "🔥",
  },
  {
    label: "Longest Streak",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    icon: "🏆",
  },
];

export default function StatsCards({
  totalAttempted,
  totalSolved,
  solveRate,
  currentStreak,
  longestStreak,
}: StatsCardsProps) {
  const values = [
    totalAttempted.toString(),
    totalSolved.toString(),
    `${solveRate}%`,
    `${currentStreak}d`,
    `${longestStreak}d`,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className={`${card.bgColor} border ${card.borderColor} rounded-xl p-4`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{card.icon}</span>
            <span className="text-xs text-gray-500 font-medium">
              {card.label}
            </span>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>{values[i]}</p>
        </motion.div>
      ))}
    </div>
  );
}
