<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Barre de recherche -->
      <div class="mb-8">
        <SearchBar />
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="!loading && !hasResults" class="bg-white rounded-lg shadow-md p-12 text-center max-w-2xl mx-auto">
        <span class="text-6xl mb-4 block">🔍</span>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          Aucun résultat trouvé
        </h3>
        <p class="text-gray-600 mb-6">
          Essayez avec d'autres mots-clés ou consultez nos suggestions ci-dessous
        </p>
        <div class="flex gap-2 justify-center flex-wrap">
          <button
            v-for="tag in popularTags"
            :key="tag"
            @click="searchByTag(tag)"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            #{{ tag }}
          </button>
        </div>
      </div>

      <!-- Résultats -->
      <div v-else>
        <!-- En-tête résultats -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Résultats de recherche
          </h2>
          <p class="text-gray-600">
            {{ totalResults }} résultat{{ totalResults > 1 ? 's' : '' }} trouvé{{ totalResults > 1 ? 's' : '' }} pour
            <span class="font-semibold">"{{ searchQuery }}"</span>
          </p>
        </div>

        <!-- Onglets -->
        <div class="mb-6 border-b border-gray-200">
          <nav class="flex gap-6">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'pb-4 px-2 font-medium transition-colors relative',
                activeTab === tab.key
                  ? 'text-primary-green border-b-2 border-primary-green'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ tab.label }} ({{ tab.count }})
            </button>
          </nav>
        </div>

        <!-- Résultats Acteurs -->
        <div v-if="activeTab === 'all' || activeTab === 'actors'">
          <div v-if="results.actors && results.actors.length > 0" class="mb-12">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="text-2xl">🏢</span>
              Acteurs ({{ results.actors.length }})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <router-link
                v-for="actor in displayedActors"
                :key="actor._id"
                :to="`/actors/${actor._id}`"
                class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 group"
              >
                <div class="flex items-start gap-4">
                  <div v-if="actor.logo" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="actor.logo" :alt="actor.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900 group-hover:text-primary-green transition-colors mb-1">
                      {{ actor.name }}
                    </h4>
                    <p class="text-sm text-gray-600 mb-2">{{ actor.type }}</p>
                    <p v-if="actor.country" class="text-xs text-gray-500">
                      📍 {{ actor.country.name?.fr }}
                    </p>
                  </div>
                </div>
              </router-link>
            </div>
            <button
              v-if="results.actors.length > actorsLimit && activeTab === 'all'"
              @click="activeTab = 'actors'"
              class="mt-4 text-primary-green hover:text-primary-green/80 font-semibold"
            >
              Voir tous les acteurs ({{ results.actors.length }}) →
            </button>
          </div>
        </div>

        <!-- Résultats Actualités -->
        <div v-if="activeTab === 'all' || activeTab === 'news'">
          <div v-if="results.news && results.news.length > 0" class="mb-12">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="text-2xl">📰</span>
              Actualités ({{ results.news.length }})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NewsCard
                v-for="newsItem in displayedNews"
                :key="newsItem._id"
                :news="newsItem"
              />
            </div>
            <button
              v-if="results.news.length > newsLimit && activeTab === 'all'"
              @click="activeTab = 'news'"
              class="mt-4 text-primary-green hover:text-primary-green/80 font-semibold"
            >
              Voir toutes les actualités ({{ results.news.length }}) →
            </button>
          </div>
        </div>

        <!-- Résultats Événements -->
        <div v-if="activeTab === 'all' || activeTab === 'events'">
          <div v-if="results.events && results.events.length > 0" class="mb-12">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="text-2xl">📅</span>
              Événements ({{ results.events.length }})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EventCard
                v-for="event in displayedEvents"
                :key="event._id"
                :event="event"
              />
            </div>
            <button
              v-if="results.events.length > eventsLimit && activeTab === 'all'"
              @click="activeTab = 'events'"
              class="mt-4 text-primary-green hover:text-primary-green/80 font-semibold"
            >
              Voir tous les événements ({{ results.events.length }}) →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '../components/search/SearchBar.vue'
import NewsCard from '../components/news/NewsCard.vue'
import EventCard from '../components/events/EventCard.vue'
import searchService from '../services/search.service'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref(null)
const results = ref({
  actors: [],
  news: [],
  events: []
})
const activeTab = ref('all')
const popularTags = ref(['solaire', 'éolien', 'biomasse', 'hydro'])

const actorsLimit = 6
const newsLimit = 4
const eventsLimit = 4

// Query de recherche
const searchQuery = computed(() => route.query.q || '')

// Total résultats
const totalResults = computed(() => {
  return (results.value.actors?.length || 0) +
         (results.value.news?.length || 0) +
         (results.value.events?.length || 0)
})

// Vérifier s'il y a des résultats
const hasResults = computed(() => totalResults.value > 0)

// Onglets avec compteurs
const tabs = computed(() => [
  { key: 'all', label: 'Tout', count: totalResults.value },
  { key: 'actors', label: 'Acteurs', count: results.value.actors?.length || 0 },
  { key: 'news', label: 'Actualités', count: results.value.news?.length || 0 },
  { key: 'events', label: 'Événements', count: results.value.events?.length || 0 }
])

// Résultats affichés selon l'onglet et la limite
const displayedActors = computed(() => {
  return activeTab.value === 'all'
    ? results.value.actors.slice(0, actorsLimit)
    : results.value.actors
})

const displayedNews = computed(() => {
  return activeTab.value === 'all'
    ? results.value.news.slice(0, newsLimit)
    : results.value.news
})

const displayedEvents = computed(() => {
  return activeTab.value === 'all'
    ? results.value.events.slice(0, eventsLimit)
    : results.value.events
})

// Effectuer la recherche
const performSearch = async () => {
  if (!searchQuery.value) return

  loading.value = true
  error.value = null

  try {
    const response = await searchService.globalSearch(searchQuery.value)
    results.value = response.data || { actors: [], news: [], events: [] }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la recherche'
    console.error('Erreur de recherche:', err)
  } finally {
    loading.value = false
  }
}

// Rechercher par tag
const searchByTag = (tag) => {
  router.push({ path: '/search', query: { q: tag } })
}

// Charger les tags populaires
const loadPopularTags = async () => {
  try {
    const response = await searchService.getPopularTags(6)
    if (response.data && response.data.length > 0) {
      popularTags.value = response.data.map(t => t.tag || t)
    }
  } catch (err) {
    console.error('Erreur lors du chargement des tags:', err)
  }
}

// Watch pour changement de query
watch(() => route.query.q, () => {
  if (route.query.q) {
    activeTab.value = 'all'
    performSearch()
  }
})

// Chargement initial
onMounted(() => {
  if (searchQuery.value) {
    performSearch()
  }
  loadPopularTags()
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
