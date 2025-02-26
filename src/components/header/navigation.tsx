"use client";

import LanguageToggle from "./language-toggle";
import { AVAILABLE_LOCALES } from "@/locales/config";
import NavLogo from "./nav-logo";
import Link from "next/link";
import NavItem from "./nav-item";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Trans } from "@lingui/macro";
import GameDropdown from "./game-dropdown";

const Navigation = ({
  lang
}: {
  lang: AVAILABLE_LOCALES
}) => {
  
  const pathname = usePathname();
  const isGamesRoute = (pathname.endsWith(`/${lang}/games`) || pathname.endsWith(`/${lang}/games/`));
  
  const [linkUrl, setLinkUrl] = useState<string>('');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let storeUrl = '';

    if (userAgent.includes('edg/')) {
      // Microsoft Edge
      storeUrl = 'https://microsoftedge.microsoft.com/addons/detail/emojiclick-toolbar/bendknbccalcldbflflcgkpbnoldneli?hl=zh-CN';
    } else if (userAgent.includes('firefox')) {
      // Firefox
      storeUrl = 'https://addons.mozilla.org/zh-CN/firefox/addon/emojiclick-toolbar/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search';
    } else {
      // Default to Chrome/Others
      storeUrl = 'https://chromewebstore.google.com/detail/emojiclick-toolbar/aconcpkdjoahofphmapdpjiioenkcaeo';
    }

    setLinkUrl(storeUrl);
  }, []);

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
              <Link target="_blank" href={linkUrl} className="text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center relative group">
                <Trans id="emoji_plugin">Emoji 插件</Trans>
              </Link>
            </NavItem>
            <GameDropdown lang={lang} isGamesRoute={isGamesRoute} />
            <LanguageToggle lang={lang} />
          </div>
        </nav>
      </div>
    </header>
  );
}

Navigation.displayName = "Navigation";

export default React.memo(Navigation);