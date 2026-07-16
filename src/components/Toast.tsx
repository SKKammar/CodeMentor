"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const STYLES: Record<ToastType, string> = {
  success: "border-success/40 bg-success/10 text-success",
  error: "border-critical/40 bg-critical/10 text-critical",
  info: "border-accent/40 bg-accent/10 text-accent",
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg pointer-events-auto max-w-sm ${STYLES[toast.type]}`}
      style={{ backgroundColor: "rgba(22, 27, 34, 0.95)" }}
    >
      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-current/20">
        {ICONS[toast.type]}
      </span>
      <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </motion.div>
  );
}
