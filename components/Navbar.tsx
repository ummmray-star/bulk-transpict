"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  const isApp = path?.startsWith("/app");

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="glass rounded-2xl mx-auto max-w-6xl flex items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="font-bold text-white text-base tracking-tight">TranscriptBulk</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isApp && (
            <Link
              href="/app"
              className="px-4 py-2 bg-[#F97316] hover:bg-[#ea6c0d] text-white text-sm font-semibold rounded-xl transition-colors duration-150 cursor-pointer"
            >
              Launch App
            </Link>
          )}
          {isApp && (
            <Link
              href="/"
              className="px-4 py-2 text-sm text-[#94a3b8] hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Home
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
