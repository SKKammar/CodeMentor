import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeMentor — Learn to Think, Not Copy",
  description:
    "An AI-powered coding assistant that teaches you to understand code through Socratic questioning, deep explanations, and visual knowledge graphs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-bg text-gray-100 antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
