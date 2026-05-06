import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'kadronix:theme'

function detectInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(detectInitialTheme())

  applyTheme(theme.value)

  watch(theme, (next) => {
    applyTheme(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  })

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function set(next: Theme) {
    theme.value = next
  }

  return { theme, toggle, set }
})
