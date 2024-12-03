"use client";

import useI18nLocale from "@/hooks/useI18nLocale";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { getLocaleFlag } from "@/utils";
import I18nLink from '@/components/i18n/i18n-link';
import { usePathname } from "next/navigation";
// import { usePathname } from "next/navigation";

export default function LanguageToggle(
  { lang }: { lang: AVAILABLE_LOCALES }
) {

  const [currentLang, locales] = useI18nLocale(lang);
  const pathname = usePathname();
  console.log('pathname=>>>', pathname)

  console.log('pathname.split=>>>', pathname.split('/').slice(2).join('/'))

  return (
    <div className="group dropdown dropdown-end dropdown-hover">
      <div tabIndex={0} role="button" className="relative btn border group-hover:border-2 group-hover:border-violet-600 bg-white m-1 hover:bg-transparent">
        <h2 className="font-semibold flex items-center gap-2 text-md">
          {getLocaleFlag(lang || DEFAULT_LOCALE)} 
          <span>{ currentLang }</span>
        </h2>
      </div>
      <ul tabIndex={0} className="dropdown-content  menu bg-base-100 border grid grid-cols-2 rounded-lg z-[1] w-[480px] p-2 shadow">
        {
          locales.map((locale) => (
            <li key={locale.key}>
              <I18nLink href={`/${pathname.split('/').slice(2).join('/')}`} lang={locale.key}>{getLocaleFlag(locale.key)} { locale.name }</I18nLink>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

