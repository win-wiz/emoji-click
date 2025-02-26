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
    <button
      type="button"
      className="outline-none flex items-center px-3 py-2 rounded-lg bg-white hover:bg-gray-50/80 transition-colors duration-200"
    >
      <div className="font-semibold flex items-center justify-between gap-2 text-md w-[116px]">
        <span>
          {getLocaleFlag(lang || DEFAULT_LOCALE)}
          <span className="ml-1 text-purple-600 hover:text-purple-800 font-normal">{currentLang}</span>
        </span>
        <ChevronDown className="w-4 h-4"/>
      </div>
    </button>
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
      className="dropdown-content menu bg-white border border-gray-100 rounded-lg z-[1] p-2 w-[154px] shadow-lg"
    >
      {locales.map((locale) => (
        <li key={locale.key} className="outline-none">
          <Link 
            href={getLocalePath(locale.key)} 
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 outline-none active:bg-purple-50"
          >
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
    <div className="dropdown dropdown-end">
      <LanguageToggleButton lang={lang} currentLang={currentLang} />
      <LanguageDropdownItems locales={locales} pathname={pathname} />
    </div>
  );
}

export default memo(LanguageToggle);

