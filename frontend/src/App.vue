<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Header />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import Header from './components/layout/Header.vue'

onMounted(() => {
  console.log('🚀 UEMOA Energy Platform - Frontend démarré')
  console.log('📡 API URL:', import.meta.env.VITE_API_URL)
})
</script>

<style>
/* Styles globaux supplémentaires si nécessaire */
</style>
