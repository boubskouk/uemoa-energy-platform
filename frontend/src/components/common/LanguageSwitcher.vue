<template>
  <div class="language-switcher">
    <button
      @click="toggleLanguage"
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
      :title="currentLanguage === 'fr' ? 'Passer en anglais' : 'Switch to French'"
    >
      <!-- Icône globe -->
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>

      <!-- Texte de la langue -->
      <span class="font-medium text-gray-700">
        {{ currentLanguage === 'fr' ? 'FR' : 'EN' }}
      </span>

      <!-- Indicateur de langue alternative -->
      <span class="text-xs text-gray-500">
        / {{ currentLanguage === 'fr' ? 'EN' : 'FR' }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()

const currentLanguage = computed(() => languageStore.currentLanguage)

const toggleLanguage = () => {
  languageStore.toggleLanguage()
}
</script>

<style scoped>
.language-switcher {
  user-select: none;
}
</style>
