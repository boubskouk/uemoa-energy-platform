<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-green to-primary-blue text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-heading font-bold mb-4">
          Répertoire des Acteurs
        </h1>
        <p class="text-lg text-white/90 max-w-2xl">
          Découvrez les acteurs des énergies renouvelables dans les 8 pays de l'UEMOA
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative max-w-2xl mx-auto">
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            placeholder="Rechercher un acteur par nom, description..."
            class="w-full px-6 py-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-green focus:border-transparent shadow-sm"
          />
          <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-green">
            🔍
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Filters -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Filtres</h2>
              <button
                v-if="hasActiveFilters"
                @click="resetAllFilters"
                class="text-sm text-primary-green hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            <!-- Pays Filter -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Pays</h3>
              <select
                v-model="filters.country"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-sm"
              >
                <option :value="null">Tous les pays</option>
                <option
                  v-for="country in countries"
                  :key="country._id"
                  :value="country._id"
                >
                  {{ country.flag }} {{ country.name.fr }}
                </option>
              </select>
            </div>

            <!-- Type Filter -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Type d'acteur</h3>
              <select
                v-model="filters.type"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-sm"
              >
                <option :value="null">Tous les types</option>
                <option value="company">Entreprise</option>
                <option value="ngo">ONG</option>
                <option value="association">Association</option>
                <option value="institution">Institution</option>
                <option value="startup">Startup</option>
                <option value="cooperative">Coopérative</option>
              </select>
            </div>

            <!-- Energy Filter -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Type d'énergie</h3>
              <select
                v-model="filters.energy"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-sm"
              >
                <option :value="null">Toutes les énergies</option>
                <option
                  v-for="energy in energies"
                  :key="energy._id"
                  :value="energy._id"
                >
                  {{ energy.icon }} {{ energy.name.fr }}
                </option>
              </select>
            </div>

            <!-- Category Filter -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Catégorie</h3>
              <select
                v-model="filters.category"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-sm"
              >
                <option :value="null">Toutes les catégories</option>
                <option
                  v-for="category in categories"
                  :key="category._id"
                  :value="category._id"
                >
                  {{ category.icon }} {{ category.name.fr }}
                </option>
              </select>
            </div>

            <!-- Additional Filters -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Options</h3>
              <label class="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  v-model="filters.verified"
                  @change="applyFilters"
                  type="checkbox"
                  class="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                />
                <span class="text-sm text-gray-700">Vérifiés uniquement</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="filters.featured"
                  @change="applyFilters"
                  type="checkbox"
                  class="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                />
                <span class="text-sm text-gray-700">En vedette</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Results Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <p class="text-gray-600">
                <span class="font-semibold text-gray-900">{{ pagination.total }}</span>
                {{ pagination.total > 1 ? 'acteurs trouvés' : 'acteur trouvé' }}
              </p>
            </div>

            <!-- Sort -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">Trier par:</label>
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-sm"
              >
                <option value="recent">Plus récent</option>
                <option value="name">Nom (A-Z)</option>
                <option value="views">Plus vus</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
            <p class="text-gray-600">Chargement des acteurs...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && actors.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Aucun acteur trouvé</h3>
            <p class="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou filtres
            </p>
            <button @click="resetAllFilters" class="btn-primary">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Actors Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <ActorCard
              v-for="actor in actors"
              :key="actor._id"
              :actor="actor"
            />
          </div>

          <!-- Pagination -->
          <div v-if="pagination.pages > 1" class="flex justify-center">
            <div class="flex items-center gap-2">
              <!-- Previous -->
              <button
                @click="goToPage(pagination.page - 1)"
                :disabled="pagination.page === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Précédent
              </button>

              <!-- Pages -->
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-4 py-2 border rounded-lg',
                  page === pagination.page
                    ? 'bg-primary-green text-white border-primary-green'
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>

              <!-- Next -->
              <button
                @click="goToPage(pagination.page + 1)"
                :disabled="pagination.page === pagination.pages"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActorsStore } from '@/stores/actors'
import { useReferenceStore } from '@/stores/reference'
import ActorCard from '@/components/actors/ActorCard.vue'

const route = useRoute()
const router = useRouter()
const actorsStore = useActorsStore()
const referenceStore = useReferenceStore()

// State
const loading = ref(false)
const searchQuery = ref('')
const sortBy = ref('recent')

const filters = ref({
  country: null,
  type: null,
  category: null,
  energy: null,
  verified: false,
  featured: false
})

// Computed
const actors = computed(() => actorsStore.actors)
const pagination = computed(() => actorsStore.pagination)
const countries = computed(() => referenceStore.countries)
const energies = computed(() => referenceStore.energies)
const categories = computed(() => referenceStore.categories)

const hasActiveFilters = computed(() => {
  return filters.value.country !== null ||
    filters.value.type !== null ||
    filters.value.category !== null ||
    filters.value.energy !== null ||
    filters.value.verified ||
    filters.value.featured ||
    searchQuery.value !== ''
})

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.pages
  const delta = 2
  const pages = []

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

// Methods
let searchTimeout = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = async () => {
  loading.value = true

  const params = {
    page: 1,
    limit: 12,
    search: searchQuery.value,
    sort: sortBy.value
  }

  // Ajouter les filtres actifs
  if (filters.value.country) params.country = filters.value.country
  if (filters.value.type) params.type = filters.value.type
  if (filters.value.category) params.category = filters.value.category
  if (filters.value.energy) params.energy = filters.value.energy
  if (filters.value.verified) params.verified = true
  if (filters.value.featured) params.featured = true

  await actorsStore.fetchActors(params)

  // Mettre à jour l'URL
  updateURL(params)

  loading.value = false
}

const resetAllFilters = () => {
  filters.value = {
    country: null,
    type: null,
    category: null,
    energy: null,
    verified: false,
    featured: false
  }
  searchQuery.value = ''
  sortBy.value = 'recent'
  applyFilters()
}

const goToPage = async (page) => {
  if (page < 1 || page > pagination.value.pages) return

  loading.value = true
  actorsStore.setPage(page)

  const params = {
    page,
    limit: 12,
    search: searchQuery.value,
    sort: sortBy.value
  }

  if (filters.value.country) params.country = filters.value.country
  if (filters.value.type) params.type = filters.value.type
  if (filters.value.category) params.category = filters.value.category
  if (filters.value.energy) params.energy = filters.value.energy
  if (filters.value.verified) params.verified = true
  if (filters.value.featured) params.featured = true

  await actorsStore.fetchActors(params)

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })

  loading.value = false
}

const updateURL = (params) => {
  const query = {}
  if (params.search) query.search = params.search
  if (params.country) query.country = params.country
  if (params.type) query.type = params.type
  if (params.category) query.category = params.category
  if (params.energy) query.energy = params.energy
  if (params.verified) query.verified = '1'
  if (params.featured) query.featured = '1'
  if (params.sort && params.sort !== 'recent') query.sort = params.sort

  router.push({ query })
}

const loadFromURL = () => {
  const query = route.query

  if (query.search) searchQuery.value = query.search
  if (query.country) filters.value.country = query.country
  if (query.type) filters.value.type = query.type
  if (query.category) filters.value.category = query.category
  if (query.energy) filters.value.energy = query.energy
  if (query.verified) filters.value.verified = true
  if (query.featured) filters.value.featured = true
  if (query.sort) sortBy.value = query.sort
}

// Lifecycle
onMounted(async () => {
  loading.value = true

  // Charger les données de référence
  await referenceStore.fetchAll()

  // Charger depuis URL
  loadFromURL()

  // Charger les acteurs
  await applyFilters()

  loading.value = false
})
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>
