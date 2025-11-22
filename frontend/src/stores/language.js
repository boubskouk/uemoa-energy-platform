import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  let i18n = null

  // State
  const currentLanguage = ref(localStorage.getItem('locale') || 'fr')

  // Getters
  const isFrench = computed(() => currentLanguage.value === 'fr')
  const isEnglish = computed(() => currentLanguage.value === 'en')

  // Initialiser i18n
  const setI18n = (i18nInstance) => {
    i18n = i18nInstance
  }

  // Actions
  const setLanguage = (lang) => {
    if (lang === 'fr' || lang === 'en') {
      currentLanguage.value = lang
      localStorage.setItem('locale', lang)
      document.documentElement.lang = lang

      // Mettre à jour i18n si disponible
      if (i18n && i18n.locale) {
        i18n.locale.value = lang
      }
    }
  }

  const toggleLanguage = () => {
    const newLang = currentLanguage.value === 'fr' ? 'en' : 'fr'
    setLanguage(newLang)
  }

  const initLanguage = () => {
    // Récupérer la langue sauvegardée ou utiliser la langue du navigateur
    const savedLang = localStorage.getItem('locale')
    if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
      currentLanguage.value = savedLang
    } else {
      // Détecter la langue du navigateur
      const browserLang = navigator.language || navigator.userLanguage
      currentLanguage.value = browserLang.startsWith('fr') ? 'fr' : 'en'
    }
    document.documentElement.lang = currentLanguage.value
  }

  /**
   * Helper pour récupérer le texte dans la bonne langue
   * @param {Object} textObject - Objet avec {fr: "...", en: "..."}
   * @returns {String} - Texte dans la langue courante
   */
  const getText = (textObject) => {
    if (!textObject) return ''
    return textObject[currentLanguage.value] || textObject.fr || textObject.en || ''
  }

  return {
    // State
    currentLanguage,
    // Getters
    isFrench,
    isEnglish,
    // Actions
    setI18n,
    setLanguage,
    toggleLanguage,
    initLanguage,
    getText
  }
})
