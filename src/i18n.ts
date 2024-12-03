import 'server-only'

import { I18n, Messages, setupI18n } from '@lingui/core'
import { locales, DEFAULT_LOCALE, siteUrl } from './locales/config'

// optionally use a stricter union type
type SupportedLocales = string

async function loadCatalog(locale: SupportedLocales): Promise<{
  [k: string]: Messages
}> {
  try {
    const { messages } = await import(`./translations/${locale}/messages.json`)
    // console.log('messages=>>>', messages)
    return {
      [locale]: messages
    }
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error)
    return {
      [locale]: {}
    }
  }
}
const catalogs = await Promise.all(locales.map(loadCatalog))

// console.log('catalogs=>>>', catalogs)
// transform array of catalogs into a single object
export const allMessages = catalogs.reduce((acc, oneCatalog) => {
  return { ...acc, ...oneCatalog }
}, {})

type AllI18nInstances = { [K in SupportedLocales]: I18n }

export const allI18nInstances: AllI18nInstances = locales.reduce(
  (acc, locale) => {
    const messages = allMessages[locale] ?? {}
    const i18n = setupI18n({
      locale,
      messages: { [locale]: messages }
    })
    return { ...acc, [locale]: i18n }
  },
  {}
)

export const getI18nInstance = (locale: SupportedLocales): I18n => {
  if (!allI18nInstances[locale]) {
    console.warn(`No i18n instance found for locale "${locale}". Falling back to 'en'.`)
    return allI18nInstances[DEFAULT_LOCALE]!
  }
  return allI18nInstances[locale]!
}

export function canonicalUrl(path: string, lang: SupportedLocales) {
  return `${siteUrl}${lang === DEFAULT_LOCALE ? '' : `/${lang}`}${path}`
}
