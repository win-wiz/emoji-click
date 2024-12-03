import { I18n, Messages } from '@lingui/core'
import { AVAILABLE_LOCALES } from './config'

export type { Messages, I18n }

export type I18nPropsNamespace = {
  initialLocale: AVAILABLE_LOCALES
  initialMessages: Messages
}

export type ServerSideGeneratedI18nNamespace = {
  _i18nPropsNamespace: I18nPropsNamespace
  locale: AVAILABLE_LOCALES
}
