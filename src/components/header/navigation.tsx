"use client";

import LanguageToggle from "./language-toggle";
import { AVAILABLE_LOCALES } from "@/locales/config";
import NavLogo from "./nav-logo";
import Link from "next/link";
import NavItem from "./nav-item";
import React from "react";
import { usePathname } from "next/navigation";
import { Trans } from "@lingui/macro";

const Navigation = ({
  lang
}: {
  lang: AVAILABLE_LOCALES
}) => {
  
  const pathname = usePathname();
  const isGamesRoute = (pathname.endsWith(`/${lang}/games`) || pathname.endsWith(`/${lang}/games/`));
  
  return (
    <header className={`sticky top-0 z-50 w-full ${
      isGamesRoute 
        ? 'bg-white/90 text-purple-600 border-purple-100' 
        : 'bg-white/90 border-purple-100'
    } backdrop-blur-sm border-b transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <NavLogo lang={lang} />
          
          <div className="flex items-center gap-6">
            <NavItem>
              {
                !isGamesRoute ? (
                  <Link href={`/${lang}/games`} className="text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center relative group">
                    <Trans>游戏</Trans>
                    <span className="absolute -top-0.5 -right-2.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] delay-300"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-rose-400 group-hover:from-red-600 group-hover:to-rose-500 transition-colors duration-200 shadow-sm"></span>
                    </span>
                  </Link>
                ) : (
                  <></>
                )
              }
            </NavItem>
            <LanguageToggle lang={lang} />
          </div>
        </nav>
      </div>
    </header>
  );
}

Navigation.displayName = "Navigation";

export default React.memo(Navigation);