
"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import LanguageToggle from "./language-toggle";
import { AVAILABLE_LOCALES } from "@/framework/locales";

export default function Navigation(
  { lang }: { lang: AVAILABLE_LOCALES }
) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-zinc-200">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              Ai Emoji
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="group relative">
              <span className="text-zinc-600 group-hover:text-violet-600 transition-all duration-300 flex items-center gap-1">
                <span>⚡️</span> Features
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/pricing" className="group relative">
              <span className="text-zinc-600 group-hover:text-violet-600 transition-all duration-300 flex items-center gap-1">
                <span>💫</span> Pricing
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              </span>
            </Link>
            <Link href="/about" className="group relative">
              <span className="text-zinc-600 group-hover:text-violet-600 transition-all duration-300 flex items-center gap-1">
                <span>🌟</span> About
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle lang={lang} />
          </div>
        </nav>
      </div>
    </header>
  );
}
