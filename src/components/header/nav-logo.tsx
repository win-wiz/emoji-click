import React from "react";
import { useMemo } from "react";
import Link from "next/link";
import { AVAILABLE_LOCALES } from "@/locales/config";

const NavLogo = ({ lang }: { lang: AVAILABLE_LOCALES }) => {
  
  const href = useMemo(() => `/${lang}`, [lang]);

  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="text-2xl">🤖</span>
      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        EmojiClick
      </span>
    </Link>
  );
};

NavLogo.displayName = "NavLogo";

export default React.memo(NavLogo);