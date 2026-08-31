import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FRA Atlas — AI-Powered Forest Rights Platform",
  description: "AI-powered platform for tracking Forest Rights Act claims across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900 font-sans">
        <main className="flex-1 min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
