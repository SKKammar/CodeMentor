"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@/types";

interface UseSessionReturn {
  session: Session | null;
  loading: boolean;
  saveSession: (sessionData: Omit<Session, "id" | "user_id" | "created_at">) => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const saveSession = async (
    sessionData: Omit<Session, "id" | "user_id" | "created_at">
  ) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("sessions")
        .insert({
          ...sessionData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setSession(data);
    } catch (error) {
      console.error("Failed to save session:", error);
    } finally {
      setLoading(false);
    }
  };

  return { session, loading, saveSession };
}
