"use client";

import useI18nLocale from "@/hooks/useI18nLocale";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { getLocaleFlag } from "@/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo, useCallback } from "react";

const LanguageToggleButton = memo(function LanguageToggleButton({ 
  lang, 
  currentLang 
}: { 
  lang: AVAILABLE_LOCALES; 
  currentLang: string;
}) {
  return (
    <div
      tabIndex={0}
      role="button"
      className="relative btn border group-hover:border-1 group-hover:border-violet-600 bg-white m-1 hover:bg-transparent"
    >
      <p className="font-semibold flex items-center justify-between gap-2 text-md w-[116px]">
        <span className="ml-2">
          {getLocaleFlag(lang || DEFAULT_LOCALE)}
          <span className="ml-1">{currentLang}</span>
        </span>
        <ChevronDown className="w-4 h-4"/>
      </p>
    </div>
  );
});

const LanguageDropdownItems = memo(function LanguageDropdownItems({
  locales,
  pathname
}: {
  locales: Array<{ key: string; name: string }>;
  pathname: string;
}) {
  const getLocalePath = useCallback((localeKey: string) => {
    const pathSegments = pathname?.split('/').slice(2).join('/');
    return `/${localeKey}/${pathSegments}`;
  }, [pathname]);

  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 border rounded-lg z-[1] p-2 w-[154px] shadow"
    >
      {locales.map((locale) => (
        <li key={locale.key}>
          <Link href={getLocalePath(locale.key)}>
            {getLocaleFlag(locale.key)} {locale.name}
          </Link>
        </li>
      ))}
    </ul>
  );
});

function LanguageToggle({ lang }: { lang: AVAILABLE_LOCALES }) {
  const [currentLang, locales] = useI18nLocale(lang);
  const pathname = usePathname();

  return (
    <div className="group dropdown dropdown-end">
      <LanguageToggleButton lang={lang} currentLang={currentLang} />
      <LanguageDropdownItems locales={locales} pathname={pathname} />
    </div>
  );
}

export default memo(LanguageToggle);

