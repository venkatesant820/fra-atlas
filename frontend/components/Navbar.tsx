"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Overview Dashboard", icon: "📊" },
    { href: "/map", label: "Interactive WebGIS", icon: "🗺️" },
    { href: "/ocr", label: "AI OCR Scanner", icon: "📄" },
    { href: "/anomaly", label: "Fraud & Anomalies", icon: "⚠️" },
    { href: "/blockchain", label: "Blockchain Titles", icon: "🔒" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:bg-green-700 transition-colors">
              FRA
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 leading-none block">FRA Atlas</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">MoTA Initiative</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-700 border border-green-200/60"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Status Indicators & Live Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-xs text-gray-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[11px] font-medium">FastAPI & WebGIS Live</span>
          </div>

          <Link
            href="/"
            className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-medium transition-colors"
          >
            Landing Pitch
          </Link>
        </div>
      </div>
    </header>
  );
}
