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
          
          <div className="flex items-center gap-4">
            <NavItem>
              {
                !isGamesRoute ? (
                  <Link href={`/${lang}/games`} className="text-purple-600 hover:text-purple-800 transition-colors">
                    <Trans>游戏</Trans>
                  </Link>
                ) : (
                  // <Link href={`/${lang}`} className="text-purple-600 hover:text-purple-800 transition-colors">
                  //   <Trans>游戏合集</Trans>
                  // </Link>
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