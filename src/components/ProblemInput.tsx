"use client";

interface ProblemInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onReset: () => void;
}

export default function ProblemInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  onReset,
}: ProblemInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe what you're stuck on or what you want to know..."
        className="flex-1 bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 font-sans resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
        rows={2}
      />
      <div className="flex flex-col gap-2">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Thinking...
            </span>
          ) : (
            "Submit"
          )}
        </button>
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 bg-transparent border border-border text-gray-400 text-sm rounded-lg hover:text-gray-200 hover:border-gray-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
