import { createI18n } from 'vue-i18n'
import fr from './locales/fr.json'
import en from './locales/en.json'

// Déterminer la langue par défaut
const defaultLocale = localStorage.getItem('locale') || 'fr'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages: {
    fr,
    en
  },
  globalInjection: true
})

export default i18n
