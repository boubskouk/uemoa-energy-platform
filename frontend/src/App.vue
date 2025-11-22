<template>
  <div id="app" class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import { useLanguageStore } from '@/stores/language'

const { locale } = useI18n()
const languageStore = useLanguageStore()

onMounted(() => {
  // Initialiser la langue au démarrage
  languageStore.initLanguage()

  // Connecter le store i18n
  languageStore.setI18n({ locale })

  console.log('🚀 UEMOA Energy Platform - Frontend démarré')
  console.log('📡 API URL:', import.meta.env.VITE_API_URL)
  console.log('🌐 Langue:', languageStore.currentLanguage)
})
</script>

<style>
/* Styles globaux supplémentaires si nécessaire */
</style>
