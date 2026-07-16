"use client";

import { useEffect } from "react";

interface ShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  /** Set true to prevent default browser behavior (default: true) */
  preventDefault?: boolean;
}

/**
 * Registers a global keyboard shortcut.
 * Works across Ctrl (Windows/Linux) and Cmd (Mac).
 */
export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  handler,
  preventDefault = true,
}: ShortcutOptions) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const modMatch =
        (ctrlKey && e.ctrlKey) || (metaKey && e.metaKey) || (!ctrlKey && !metaKey);
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        modMatch &&
        e.shiftKey === shiftKey
      ) {
        if (preventDefault) e.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, ctrlKey, metaKey, shiftKey, handler, preventDefault]);
}
