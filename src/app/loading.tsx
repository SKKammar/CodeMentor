export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-border rounded-full" />
          <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
