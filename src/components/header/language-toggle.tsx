"use client";

import useI18nLocale from "@/hooks/useI18nLocale";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { getLocaleFlag } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function LanguageToggle({ lang }: { lang: AVAILABLE_LOCALES }) {
  const [currentLang, locales] = useI18nLocale(lang);
  const pathname = usePathname();

  const dropdownItems = useMemo(() => {
    return locales.map((locale) => (
      <li key={locale.key}>
        <Link href={`/${locale.key}/${pathname?.split('/').slice(2).join('/')}`}>
          {getLocaleFlag(locale.key)} {locale.name}
        </Link>
      </li>
    ));
  }, [locales, pathname]);

  return (
    <div className="group dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="relative btn border group-hover:border-1 group-hover:border-violet-600 bg-white m-1 hover:bg-transparent"
      >
        <p className="font-semibold flex items-center gap-2 text-md w-[120px]">
          {getLocaleFlag(lang || DEFAULT_LOCALE)}
          <span>{currentLang}</span>
        </p>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 border rounded-lg z-[1] p-2 w-[160px] shadow"
      >
        {dropdownItems}
      </ul>
    </div>
  );
}

