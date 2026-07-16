"use client";

import { useCallback, useState } from "react";
import { ToastItem, ToastType } from "@/components/Toast";

/**
 * Manages a queue of toast notifications.
 * Toasts auto-dismiss after 4 seconds.
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      return id;
    },
    []
  );

  return {
    toasts,
    dismiss,
    show,
    success: (msg: string) => show(msg, "success"),
    error: (msg: string) => show(msg, "error"),
    info: (msg: string) => show(msg, "info"),
  };
}
