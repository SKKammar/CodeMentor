"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatsCards from "@/components/dashboard/StatsCards";
import LanguageChart from "@/components/dashboard/LanguageChart";
import HintScoreChart from "@/components/dashboard/HintScoreChart";
import StreakTracker from "@/components/dashboard/StreakTracker";
import { useAuth } from "@/hooks/useAuth";
import { DashboardStats } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Not authenticated — show login prompt
  if (!authLoading && !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            Sign in to view your dashboard
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Track your learning progress, streaks, and concept knowledge.
          </p>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats || stats.total_attempted === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            No sessions yet
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Start a coding session to build your learning dashboard.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-colors"
          >
            Start Coding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your learning progress and growth over time.
        </p>
      </motion.div>

      {/* Stats cards row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatsCards
          totalAttempted={stats.total_attempted}
          totalSolved={stats.total_solved}
          solveRate={stats.solve_rate}
          currentStreak={stats.current_streak}
          longestStreak={stats.longest_streak}
        />
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <LanguageChart data={stats.languages} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HintScoreChart data={stats.hint_scores} />
        </motion.div>
      </div>

      {/* Streak tracker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StreakTracker
          currentStreak={stats.current_streak}
          longestStreak={stats.longest_streak}
        />
      </motion.div>
    </div>
  );
}
