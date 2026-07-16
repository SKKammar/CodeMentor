"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          {error.message ||
            "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-4 py-2 border border-border text-gray-300 text-sm rounded-lg hover:border-gray-500 transition-colors"
          >
            Go Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
