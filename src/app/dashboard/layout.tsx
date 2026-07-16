"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/graph", label: "Knowledge Graph" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Dashboard header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-accent">
            CodeMentor
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-accent transition-colors"
        >
          ← Back to Editor
        </Link>
      </header>

      {/* Dashboard content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
