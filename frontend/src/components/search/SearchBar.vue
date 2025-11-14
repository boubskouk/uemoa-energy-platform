<template>
  <div class="relative w-full max-w-2xl" ref="searchContainer">
    <form @submit.prevent="handleSubmit" class="relative">
      <!-- Barre de recherche -->
      <div class="relative">
        <input
          v-model="query"
          @input="handleInput"
          @focus="showSuggestions = true"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="selectSuggestion(selectedIndex)"
          @keydown.esc="closeSuggestions"
          type="text"
          placeholder="Rechercher des acteurs, actualités, événements..."
          class="w-full px-12 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-green focus:outline-none transition-colors"
        />

        <!-- Icône recherche -->
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Bouton effacer -->
        <button
          v-if="query"
          @click="clearSearch"
          type="button"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Loading spinner -->
        <div v-if="loading" class="absolute right-12 top-1/2 transform -translate-y-1/2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-green"></div>
        </div>
      </div>

      <!-- Dropdown suggestions -->
      <div
        v-if="showSuggestions && (suggestions.length > 0 || recentSearches.length > 0)"
        class="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto"
      >
        <!-- Recherches récentes -->
        <div v-if="!query && recentSearches.length > 0" class="p-2 border-b border-gray-100">
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
            Recherches récentes
          </div>
          <button
            v-for="(search, index) in recentSearches"
            :key="'recent-' + index"
            @click="selectRecent(search)"
            class="w-full px-3 py-2 text-left hover:bg-gray-50 rounded flex items-center gap-2 group"
          >
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="flex-1 text-gray-700">{{ search }}</span>
            <button
              @click.stop="removeRecent(index)"
              class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </button>
        </div>

        <!-- Suggestions -->
        <div v-if="suggestions.length > 0" class="p-2">
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
            Suggestions
          </div>
          <button
            v-for="(suggestion, index) in suggestions"
            :key="'suggestion-' + index"
            @click="selectSuggestion(index)"
            :class="[
              'w-full px-3 py-2 text-left rounded flex items-center gap-3',
              selectedIndex === index ? 'bg-primary-green/10' : 'hover:bg-gray-50'
            ]"
          >
            <span class="text-xl">{{ getTypeIcon(suggestion.type) }}</span>
            <div class="flex-1">
              <p class="text-gray-800 font-medium" v-html="highlightText(suggestion.title, query)"></p>
              <p class="text-xs text-gray-500">{{ getTypeLabel(suggestion.type) }}</p>
            </div>
          </button>
        </div>

        <!-- Aucun résultat -->
        <div v-if="query && suggestions.length === 0 && !loading" class="p-6 text-center text-gray-500">
          <p>Aucune suggestion trouvée pour "{{ query }}"</p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import searchService from '../../services/search.service'

const router = useRouter()

const query = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)
const loading = ref(false)
const selectedIndex = ref(-1)
const searchContainer = ref(null)
const recentSearches = ref([])

let debounceTimer = null

// Charger les recherches récentes
onMounted(() => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }

  // Fermer les suggestions au clic extérieur
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Gérer l'input avec debounce
const handleInput = () => {
  clearTimeout(debounceTimer)

  if (query.value.length < 2) {
    suggestions.value = []
    return
  }

  debounceTimer = setTimeout(async () => {
    await fetchSuggestions()
  }, 300)
}

// Récupérer les suggestions
const fetchSuggestions = async () => {
  if (!query.value) return

  loading.value = true
  try {
    const response = await searchService.getSuggestions(query.value, 8)
    suggestions.value = response.data || []
    selectedIndex.value = -1
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

// Soumettre la recherche
const handleSubmit = () => {
  if (!query.value.trim()) return

  saveToRecent(query.value)
  router.push({
    path: '/search',
    query: { q: query.value }
  })
  closeSuggestions()
}

// Sélectionner une suggestion
const selectSuggestion = (index) => {
  if (index < 0 || index >= suggestions.value.length) {
    handleSubmit()
    return
  }

  const suggestion = suggestions.value[index]
  saveToRecent(suggestion.title)

  // Rediriger vers la page appropriée
  const paths = {
    actor: '/actors',
    news: '/news',
    event: '/events'
  }

  router.push(`${paths[suggestion.type]}/${suggestion.slug}`)
  closeSuggestions()
  query.value = ''
}

// Sélectionner une recherche récente
const selectRecent = (search) => {
  query.value = search
  handleSubmit()
}

// Supprimer une recherche récente
const removeRecent = (index) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// Sauvegarder dans les recherches récentes
const saveToRecent = (search) => {
  const trimmed = search.trim()
  if (!trimmed) return

  // Retirer si déjà présent
  recentSearches.value = recentSearches.value.filter(s => s !== trimmed)

  // Ajouter au début
  recentSearches.value.unshift(trimmed)

  // Limiter à 5
  recentSearches.value = recentSearches.value.slice(0, 5)

  // Sauvegarder
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// Navigation au clavier
const navigateDown = () => {
  if (selectedIndex.value < suggestions.value.length - 1) {
    selectedIndex.value++
  }
}

const navigateUp = () => {
  if (selectedIndex.value > -1) {
    selectedIndex.value--
  }
}

// Effacer la recherche
const clearSearch = () => {
  query.value = ''
  suggestions.value = []
  selectedIndex.value = -1
}

// Fermer les suggestions
const closeSuggestions = () => {
  showSuggestions.value = false
  selectedIndex.value = -1
}

// Clic extérieur
const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    closeSuggestions()
  }
}

// Obtenir l'icône par type
const getTypeIcon = (type) => {
  const icons = {
    actor: '🏢',
    news: '📰',
    event: '📅'
  }
  return icons[type] || '🔍'
}

// Obtenir le label du type
const getTypeLabel = (type) => {
  const labels = {
    actor: 'Acteur',
    news: 'Actualité',
    event: 'Événement'
  }
  return labels[type] || type
}

// Surligner le texte recherché
const highlightText = (text, search) => {
  if (!search) return text
  const regex = new RegExp(`(${search})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}
</script>

<style scoped>
/* Styles pour les suggestions */
</style>
