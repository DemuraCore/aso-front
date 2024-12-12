<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
</script>

<template>
  <header class="h-14 gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <AppNavbar />
  </header>
  <div class="max-w-2xl mx-auto p-4">
    <router-view />
  </div>
</template>
