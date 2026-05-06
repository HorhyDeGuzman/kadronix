<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppHeader } from '@/common/components/layout'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.app__main {
  flex: 1;
}
</style>
