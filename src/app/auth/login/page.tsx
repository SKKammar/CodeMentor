"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-accent">
            CodeMentor
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to track your learning progress
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
          {/* GitHub OAuth */}
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-900 font-medium text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent text-white font-medium text-sm rounded-lg hover:bg-accent/80 disabled:opacity-50 transition-colors"
            >
              Sign In
            </button>
          </form>

          {error && (
            <p className="text-sm text-critical text-center">{error}</p>
          )}

          <p className="text-xs text-gray-500 text-center">
            Don&apos;t have an account?{" "}
            <button
              onClick={async () => {
                if (!email) {
                  setError("Enter your email above first");
                  return;
                }
                const { error } = await supabase.auth.signUp({
                  email,
                  password,
                });
                if (error) setError(error.message);
                else setError("Check your email for a confirmation link!");
              }}
              className="text-accent hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-accent transition-colors"
          >
            ← Back to CodeMentor
          </Link>
        </p>
      </div>
    </div>
  );
}
