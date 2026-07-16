"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-9 w-20 bg-border rounded-lg animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 font-mono truncate max-w-[150px]">
          {user.email}
        </span>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="px-3 py-1.5 text-sm text-gray-400 border border-border rounded-lg hover:text-gray-200 hover:border-gray-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="px-4 py-1.5 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent/10 transition-colors"
    >
      Sign In
    </Link>
  );
}
