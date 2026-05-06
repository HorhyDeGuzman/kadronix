<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const TMDB_LOGO_URL =
  'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg'
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <a
        class="footer__credit"
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        :title="t('footer.tmdbCredit')"
      >
        <img class="footer__tmdb-logo" :src="TMDB_LOGO_URL" alt="TMDB" />
        <span>{{ t('footer.tmdbCredit') }}</span>
      </a>

      <p class="footer__disclaimer">{{ t('footer.tmdbDisclaimer') }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-md) 0;
  margin-top: var(--space-xl);
}

.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.footer__credit {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color 0.2s var(--ease-out);
}

.footer__credit:hover {
  color: var(--color-text);
}

.footer__tmdb-logo {
  height: 18px;
  width: auto;
  display: block;
}

.footer__disclaimer {
  font-size: 0.75rem;
  color: var(--color-text-faint);
  max-width: 540px;
  text-align: right;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer__disclaimer {
    text-align: left;
  }
}
</style>
