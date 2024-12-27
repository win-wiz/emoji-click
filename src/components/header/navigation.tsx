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
  console.log(pathname);
  const isGamesRoute = (pathname.endsWith(`/${lang}/games`) || pathname.endsWith(`/${lang}/games/`));
  
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md ${isGamesRoute ? 'bg-gray-900' : ''} border-b border-zinc-200`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <NavLogo lang={lang} />
          
          <div className="flex items-center gap-4">
            {/* 游戏 */}
            <NavItem>
              {
                !isGamesRoute ? (
                  <Link href={`/${lang}/games`}>
                    <Trans>游戏</Trans>
                  </Link>
                ) : (
                  <Link href={`/${lang}`}>
                    <Trans>游戏合集</Trans>
                  </Link>
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