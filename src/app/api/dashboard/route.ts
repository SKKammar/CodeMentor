import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = (await cookieStore.get("sb-access-token"))?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createServerClient(token);

    // Fetch all sessions for this user
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Dashboard fetch error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch sessions" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!sessions || sessions.length === 0) {
      return new Response(
        JSON.stringify({
          total_attempted: 0,
          total_solved: 0,
          solve_rate: 0,
          current_streak: 0,
          longest_streak: 0,
          languages: [],
          hint_scores: [],
          recent_sessions: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Calculate stats
    const totalAttempted = sessions.length;
    const totalSolved = sessions.filter((s) => s.solved_independently).length;
    const solveRate = totalAttempted > 0 ? totalSolved / totalAttempted : 0;

    // Language distribution
    const langMap = new Map<string, number>();
    sessions.forEach((s) => {
      langMap.set(s.language, (langMap.get(s.language) || 0) + 1);
    });
    const languages = Array.from(langMap.entries()).map(([language, count]) => ({
      language,
      count,
    }));

    // Hint dependency over time (by date)
    const dateMap = new Map<string, { total: number; hints: number }>();
    sessions.forEach((s) => {
      const date = s.created_at?.split("T")[0] || "unknown";
      const entry = dateMap.get(date) || { total: 0, hints: 0 };
      entry.total += 1;
      entry.hints += s.hint_count;
      dateMap.set(date, entry);
    });
    const hintScores = Array.from(dateMap.entries())
      .map(([date, { total, hints }]) => ({
        date,
        avg_hints: total > 0 ? Math.round((hints / total) * 10) / 10 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Streak calculation
    const uniqueDates = Array.from(
      new Set(
        sessions.map((s) => s.created_at?.split("T")[0] || "").filter(Boolean)
      )
    ).sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let streakCount = 0;

    const today = new Date().toISOString().split("T")[0];
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const expected = new Date(
        new Date(today).getTime() - (uniqueDates.length - 1 - i) * 86400000
      )
        .toISOString()
        .split("T")[0];

      if (uniqueDates[i] === expected) {
        streakCount++;
      } else {
        break;
      }
    }
    currentStreak = streakCount;

    // Longest streak (consecutive days)
    streakCount = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        streakCount = 1;
      } else {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
        streakCount = diffDays === 1 ? streakCount + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, streakCount);
    }

    return new Response(
      JSON.stringify({
        total_attempted: totalAttempted,
        total_solved: totalSolved,
        solve_rate: Math.round(solveRate * 100),
        current_streak: currentStreak,
        longest_streak: longestStreak,
        languages,
        hint_scores: hintScores,
        recent_sessions: sessions.slice(0, 10),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Dashboard API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
