import { AVAILABLE_LOCALES, DEFAULT_LOCALE, locales } from "./config"
import { globalI18n } from "./i18n"
import { serverSideTranslations } from "./serverSideTranslations"

export function isAcceptedLocale(locale: unknown): locale is AVAILABLE_LOCALES {
  if (typeof locale !== 'string') {
    return false
  }

  return locales.includes(locale)
}

export function selectFirstAcceptedLocale(
  ...mayBeLocales: Array<unknown>
): AVAILABLE_LOCALES {
  for (const mayBeLocale of mayBeLocales) {
    if (isAcceptedLocale(mayBeLocale)) {
      return mayBeLocale
    }
  }
  return DEFAULT_LOCALE as AVAILABLE_LOCALES
}

export function metadataLanguages(subPath:string){
  const langKeys = Object.values(AVAILABLE_LOCALES)
  const path = process.env.UE_WEB_API_URL
  const languages: any = {}
  langKeys.forEach((lang) => {
    languages[lang] = `${path}/${lang}${subPath}`
  })
  return languages
}


export async function activateLocale(lang: AVAILABLE_LOCALES) {
  const i18n = await serverSideTranslations(
    lang
  )
  const locale = i18n._i18nPropsNamespace.initialLocale
  const messages = i18n._i18nPropsNamespace.initialMessages
  globalI18n.loadAndActivate({ locale, messages })
  globalI18n.activate(lang)
}