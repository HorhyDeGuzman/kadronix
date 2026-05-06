<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Moon, Sun } from 'lucide-vue-next'
import { useThemeStore } from '@/common/store/theme.store'
import { useLocaleStore } from '@/common/store/locale.store'
import type { Locale } from '@/common/i18n'
import logoUrl from '@/common/assets/icons/Kadronix-logo.png'

const { t } = useI18n()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

const isDark = computed(() => themeStore.theme === 'dark')

function setLocale(next: Locale) {
  localeStore.set(next)
}
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__brand">
        <span class="header__logo-wrap">
          <img class="header__logo" :src="logoUrl" :alt="t('app.title')" />
        </span>
        <span class="header__title">{{ t('app.title') }}</span>
      </RouterLink>

      <div class="header__controls">
        <div class="header__lang" role="group" :aria-label="t('language.toggle')">
          <button
            type="button"
            class="header__lang-btn"
            :class="{ 'header__lang-btn--active': localeStore.locale === 'ru' }"
            @click="setLocale('ru')"
          >
            RU
          </button>
          <button
            type="button"
            class="header__lang-btn"
            :class="{ 'header__lang-btn--active': localeStore.locale === 'en' }"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>

        <button
          type="button"
          class="header__theme-btn"
          :title="t('theme.toggle')"
          :aria-label="t('theme.toggle')"
          @click="themeStore.toggle"
        >
          <Sun v-if="isDark" :size="18" aria-hidden="true" />
          <Moon v-else :size="18" aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: color-mix(in srgb, var(--color-bg) 80%, transparent);
  backdrop-filter: saturate(140%) blur(16px);
  -webkit-backdrop-filter: saturate(140%) blur(16px);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  transition: opacity 0.2s var(--ease-out);
}

.header__brand:hover {
  opacity: 0.85;
}

.header__logo-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.header__logo-wrap::after {
  content: '';
  position: absolute;
  inset: -6px;
  background: radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s var(--ease-out);
}

.header__brand:hover .header__logo-wrap::after {
  opacity: 1;
}

.header__logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
}

.header__title {
  background: linear-gradient(
    135deg,
    var(--color-text) 0%,
    var(--color-accent) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header__controls {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.header__lang {
  display: inline-flex;
  padding: 3px;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
}

.header__lang-btn {
  padding: 5px 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  border-radius: var(--radius-pill);
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.header__lang-btn:hover {
  color: var(--color-text);
}

.header__lang-btn--active {
  background-color: var(--color-accent);
  color: var(--color-accent-text);
}

.header__lang-btn--active:hover {
  background-color: var(--color-accent-hover);
  color: var(--color-accent-text);
}

.header__theme-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);
}

.header__theme-btn:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-accent);
  transform: rotate(15deg);
}
</style>
