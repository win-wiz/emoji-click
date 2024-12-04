"use client";

import { AVAILABLE_LOCALES, localeNames, locales } from "@/locales/config";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function I18nLink({ 
  params,
}: { 
  params?: { lang: AVAILABLE_LOCALES }
}) {

  const pathname = usePathname();
  
  const pathWithoutLocale = pathname.split('/')[2];
  return (
    <div>
      {
        locales.map(locale => (
          <Link key={locale} href={`/${locale}/${pathWithoutLocale}`}>
            { localeNames[locale as keyof typeof localeNames] }
          </Link>
        ))
      }
    </div>
  )
}