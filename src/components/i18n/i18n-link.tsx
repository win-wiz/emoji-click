import Link from "next/link";
import config from "../../../lingui.config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function I18nLink({ children, href, lang, ...props }: { children: React.ReactNode; href: string; lang: string;[key: string]: any }) {
  // console.log('lang=>>>', lang)
  // console.log('href=>>>', href)
  return <Link href={i18nLinkStr(href, lang)} {...props}>{children}</Link>
}

export function i18nLinkStr(str: string, lang: string) {
  if (lang === config.sourceLocale) {
    return str
  }
  return `/${lang}${str}`
}
