"use client";

import Link from "next/link";
import LanguageToggle from "./language-toggle";
import { AVAILABLE_LOCALES } from "@/locales/config";

export default function Navigation(
  { lang }: { lang: AVAILABLE_LOCALES }
) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-zinc-200">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              EmojiClick
            </span>
          </Link>
          

          <div className="flex items-center gap-4">
            <LanguageToggle lang={lang} />
          </div>
        </nav>
      </div>
    </header>
  );
}
