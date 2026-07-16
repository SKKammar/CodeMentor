import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-accent font-mono">404</p>
        <h1 className="text-2xl font-bold text-gray-100 mt-4 mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-colors"
        >
          Back to CodeMentor
        </Link>
      </div>
    </div>
  );
}
