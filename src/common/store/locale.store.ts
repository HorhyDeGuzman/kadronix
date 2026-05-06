import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { i18n, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, type Locale } from '@/common/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>(i18n.global.locale.value as Locale)

  watch(locale, (next) => {
    i18n.global.locale.value = next
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    document.documentElement.lang = next
  })

  document.documentElement.lang = locale.value

  function set(next: Locale) {
    if (SUPPORTED_LOCALES.includes(next)) locale.value = next
  }

  function toggle() {
    locale.value = locale.value === 'ru' ? 'en' : 'ru'
  }

  return { locale, set, toggle }
})
