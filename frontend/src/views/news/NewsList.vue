<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-4xl font-heading font-bold text-gray-900 mb-4">
          Actualités
        </h1>
        <p class="text-lg text-gray-600">
          Découvrez les dernières nouvelles de l'énergie dans l'espace UEMOA
        </p>
      </div>

      <!-- Actualités à la une -->
      <div v-if="featuredNews.length > 0" class="mb-12">
        <h2 class="text-2xl font-heading font-bold text-gray-800 mb-6">
          ⭐ À la une
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewsCard
            v-for="newsItem in featuredNews"
            :key="newsItem._id"
            :news="newsItem"
          />
        </div>
      </div>

      <!-- Contenu principal avec filtres -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar avec filtres -->
        <aside class="lg:col-span-1">
          <NewsFilters
            :initial-filters="filters"
            @update:filters="handleFiltersUpdate"
          />
        </aside>

        <!-- Liste des actualités -->
        <main class="lg:col-span-3">
          <!-- État de chargement -->
          <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
          </div>

          <!-- Message d'erreur -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p class="text-red-600">{{ error }}</p>
            <button
              @click="loadNews"
              class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>

          <!-- Aucun résultat -->
          <div v-else-if="!loading && newsList.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
            <span class="text-6xl mb-4 block">📰</span>
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              Aucune actualité trouvée
            </h3>
            <p class="text-gray-600">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>

          <!-- Grille des actualités -->
          <div v-else>
            <div class="mb-6">
              <p class="text-sm text-gray-600">
                {{ pagination.total }} actualité{{ pagination.total > 1 ? 's' : '' }} trouvée{{ pagination.total > 1 ? 's' : '' }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <NewsCard
                v-for="newsItem in newsList"
                :key="newsItem._id"
                :news="newsItem"
              />
            </div>

            <!-- Pagination -->
            <Pagination
              :current-page="pagination.page"
              :total-pages="pagination.pages"
              :total="pagination.total"
              :per-page="pagination.limit"
              @page-change="handlePageChange"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNewsStore } from '../../stores/news'
import NewsCard from '../../components/news/NewsCard.vue'
import NewsFilters from '../../components/news/NewsFilters.vue'
import Pagination from '../../components/common/Pagination.vue'

const newsStore = useNewsStore()

// State réactifs du store
const newsList = computed(() => newsStore.news)
const featuredNews = computed(() => newsStore.featuredNews)
const loading = computed(() => newsStore.loading)
const error = computed(() => newsStore.error)
const pagination = computed(() => newsStore.pagination)

// Filtres locaux
const filters = ref({
  search: '',
  category: null,
  country: null,
  featured: null
})

// Charger les actualités
const loadNews = async () => {
  try {
    await newsStore.fetchNews()
  } catch (err) {
    console.error('Erreur lors du chargement des actualités:', err)
  }
}

// Charger les actualités à la une
const loadFeaturedNews = async () => {
  try {
    await newsStore.fetchFeaturedNews(3)
  } catch (err) {
    console.error('Erreur lors du chargement des actualités à la une:', err)
  }
}

// Gérer la mise à jour des filtres
const handleFiltersUpdate = async (newFilters) => {
  filters.value = newFilters
  newsStore.updateFilters(newFilters)
  newsStore.setPage(1) // Retour à la page 1 lors du changement de filtres
  await loadNews()
}

// Gérer le changement de page
const handlePageChange = async (page) => {
  newsStore.setPage(page)
  await loadNews()
  // Scroll vers le haut
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Chargement initial
onMounted(() => {
  loadNews()
  loadFeaturedNews()
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
