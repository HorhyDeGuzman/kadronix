<script setup lang="ts">
import { MainHero, ModesGrid } from '@/modules/main'
</script>

<template>
  <div class="home-page">
    <MainHero />
    <div class="container home-page__sections">
      <ModesGrid />
    </div>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--space-xl);
}

.home-page__sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
</style>
