import { createI18n } from 'vue-i18n'
import ru from './ru'
import en from './en'

export type Locale = 'ru' | 'en'

export const SUPPORTED_LOCALES: Locale[] = ['ru', 'en']
export const DEFAULT_LOCALE: Locale = 'ru'
export const LOCALE_STORAGE_KEY = 'kadronix:locale'

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored
  return DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { ru, en },
})

export const TMDB_LANGUAGE_BY_LOCALE: Record<Locale, string> = {
  ru: 'ru-RU',
  en: 'en-US',
}
