"use client";

import { useMemo, useRef, useEffect } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";

interface MonacoEditorProps {
  code: string;
  onChange: (value: string) => void;
}

/** Maps file extensions to Monaco language identifiers */
const EXT_TO_LANG: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  cs: "csharp",
  go: "go",
  rs: "rust",
  rb: "ruby",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  sql: "sql",
  html: "html",
  css: "css",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  sh: "shell",
  bash: "shell",
};

/** Heuristic language detection based on code content */
function detectLanguage(code: string): string {
  // Try to guess from content patterns
  if (/fn\s+\w+.*->/.test(code)) return "rust";
  if (/func\s+\w+\(/.test(code)) return "go";
  if (/def\s+\w+\(/.test(code) && /:\s*$/.test(code.split("\n")[0]))
    return "python";
  if (/public\s+(static\s+)?void\s+main/.test(code)) return "java";
  if (/using\s+namespace\s+std/.test(code)) return "cpp";
  if (/^import\s+java\./.test(code)) return "java";
  if (/require\s*\(/.test(code) || /module\.exports/.test(code)) return "javascript";

  return "plaintext";
}

export default function MonacoEditor({ code, onChange }: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  const detectedLanguage = useMemo(() => {
    if (!code.trim()) return "plaintext";
    return detectLanguage(code);
  }, [code]);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange: OnChange = (value) => {
    onChange(value || "");
  };

  return (
    <div className="flex-1 min-h-0">
      <div className="px-3 py-1.5 border-b border-border bg-surface flex items-center justify-between">
        <span className="text-xs text-gray-500 font-mono">
          {detectedLanguage.toUpperCase()}
        </span>
        <span className="text-xs text-gray-600">Paste or type your code</span>
      </div>
      <Editor
        height="100%"
        language={detectedLanguage}
        value={code}
        onChange={handleChange}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-jetbrains), JetBrains Mono, monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
          renderLineHighlight: "line",
          bracketPairColorization: { enabled: true },
          wordWrap: "on",
          tabSize: 2,
        }}
      />
    </div>
  );
}
