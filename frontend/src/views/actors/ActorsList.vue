<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
    <!-- Hero Section with Animated Counter -->
    <div class="bg-gradient-to-br from-primary-green via-green-600 to-primary-blue text-white py-16 relative overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-8">
          <h1 class="text-5xl md:text-6xl font-heading font-bold mb-4 animate-fade-in">
            Répertoire des Acteurs
          </h1>
          <p class="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Découvrez les acteurs des énergies renouvelables dans les 8 pays de l'UEMOA
          </p>

          <!-- Animated Counter -->
          <div class="inline-block bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
            <div class="flex items-center gap-3">
              <span class="text-5xl font-bold animate-counter">{{ displayCounter }}</span>
              <span class="text-lg">Acteurs Engagés</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 -mt-8 relative z-20">
      <!-- Interactive Country Flags Filter -->
      <div class="mb-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
        <h3 class="text-lg font-bold text-gray-900 mb-4 text-center">Filtrer par Pays UEMOA</h3>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            @click="toggleCountryFilter(null)"
            :class="[
              'px-4 py-2 rounded-xl font-semibold transition-all duration-300',
              filters.country === null
                ? 'bg-gradient-to-r from-primary-green to-green-600 text-white shadow-lg scale-105'
                : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-md'
            ]"
          >
            🌍 Tous
          </button>
          <button
            v-for="country in countries"
            :key="country._id"
            @click="toggleCountryFilter(country._id)"
            :class="[
              'px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2',
              filters.country === country._id
                ? 'bg-gradient-to-r from-primary-blue to-blue-600 text-white shadow-lg scale-105'
                : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-md'
            ]"
          >
            <span class="text-2xl">{{ country.flag }}</span>
            <span>{{ country.code }}</span>
          </button>
        </div>
      </div>

      <!-- Search Bar with glassmorphism -->
      <div class="mb-8">
        <div class="relative max-w-3xl mx-auto">
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            placeholder="🔍 Rechercher un acteur par nom, ville, domaine d'activité..."
            class="w-full px-6 py-5 pr-12 rounded-2xl border-2 border-white/50 bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-primary-green focus:border-primary-green shadow-lg transition-all text-lg"
          />
          <button class="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-green transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Interactive Type & Energy Filters -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Type Filter -->
        <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-5 border border-white/20">
          <h3 class="text-sm font-bold text-gray-900 mb-3">Type d'Acteur</h3>
          <div class="flex flex-wrap gap-2">
            <button
              @click="toggleTypeFilter(null)"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filters.type === null
                  ? 'bg-primary-green text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Tous
            </button>
            <button
              v-for="type in actorTypes"
              :key="type.value"
              @click="toggleTypeFilter(type.value)"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filters.type === type.value
                  ? 'bg-primary-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ type.icon }} {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Energy Filter -->
        <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-5 border border-white/20">
          <h3 class="text-sm font-bold text-gray-900 mb-3">Type d'Énergie</h3>
          <div class="flex flex-wrap gap-2">
            <button
              @click="toggleEnergyFilter(null)"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filters.energy === null
                  ? 'bg-primary-green text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Toutes
            </button>
            <button
              v-for="energy in energies"
              :key="energy._id"
              @click="toggleEnergyFilter(energy._id)"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filters.energy === energy._id
                  ? 'bg-primary-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ energy.icon }} {{ energy.name.fr }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Compact Sidebar Filters -->
        <aside class="lg:w-72 flex-shrink-0">
          <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sticky top-4 border border-white/20">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Options</h2>
              <button
                v-if="hasActiveFilters"
                @click="resetAllFilters"
                class="text-sm text-primary-green hover:text-green-700 font-semibold transition-colors"
              >
                ✕ Réinitialiser
              </button>
            </div>

            <!-- Category Filter -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📂</span> Catégorie
              </h3>
              <select
                v-model="filters.category"
                @change="applyFilters"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-primary-green text-sm bg-white transition-all"
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

            <!-- Sort Options -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🔄</span> Trier par
              </h3>
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-primary-green text-sm bg-white transition-all"
              >
                <option value="recent">Plus récent</option>
                <option value="name">Nom (A-Z)</option>
                <option value="views">Plus vus</option>
              </select>
            </div>

            <!-- Status Filters -->
            <div class="space-y-3">
              <h3 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>✓</span> Statut
              </h3>
              <label class="flex items-center gap-3 p-3 rounded-xl bg-green-50 border-2 border-transparent hover:border-green-200 cursor-pointer transition-all">
                <input
                  v-model="filters.verified"
                  @change="applyFilters"
                  type="checkbox"
                  class="w-5 h-5 text-primary-green border-gray-300 rounded focus:ring-primary-green"
                />
                <span class="text-sm font-medium text-gray-800">✓ Acteurs vérifiés</span>
              </label>
              <label class="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border-2 border-transparent hover:border-blue-200 cursor-pointer transition-all">
                <input
                  v-model="filters.featured"
                  @change="applyFilters"
                  type="checkbox"
                  class="w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <span class="text-sm font-medium text-gray-800">⭐ En vedette</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Results Header with glassmorphism -->
          <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-5 mb-6 border border-white/20">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-green to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {{ pagination.total }}
                </div>
                <div>
                  <p class="text-lg font-bold text-gray-900">
                    {{ pagination.total > 1 ? 'Acteurs trouvés' : 'Acteur trouvé' }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ filters.country ? countries.find(c => c._id === filters.country)?.name.fr : 'Tous les pays' }}
                  </p>
                </div>
              </div>

              <!-- Active filters badges -->
              <div class="flex flex-wrap gap-2 justify-end">
                <span
                  v-if="filters.verified"
                  class="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                >
                  ✓ Vérifiés
                </span>
                <span
                  v-if="filters.featured"
                  class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                >
                  ⭐ En vedette
                </span>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-20">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-green to-primary-blue rounded-2xl mb-6 animate-pulse">
              <div class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p class="text-lg font-semibold text-gray-700">Chargement des acteurs...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && actors.length === 0" class="text-center py-20">
            <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-12 border border-white/20 max-w-md mx-auto">
              <div class="text-8xl mb-6">🔍</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Aucun acteur trouvé</h3>
              <p class="text-gray-600 mb-8">
                Essayez de modifier vos critères de recherche ou filtres
              </p>
              <button
                @click="resetAllFilters"
                class="px-6 py-3 bg-gradient-to-r from-primary-green to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          <!-- Actors Grid with fade-in animation -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div
              v-for="(actor, index) in actors"
              :key="actor._id"
              :style="{ animationDelay: `${index * 50}ms` }"
              class="animate-fade-in-up"
            >
              <ActorCard :actor="actor" />
            </div>
          </div>

          <!-- Pagination with glassmorphism -->
          <div v-if="pagination.pages > 1" class="flex justify-center">
            <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-2 border border-white/20 inline-flex items-center gap-2">
              <!-- Previous -->
              <button
                @click="goToPage(pagination.page - 1)"
                :disabled="pagination.page === 1"
                :class="[
                  'px-5 py-3 rounded-xl font-semibold transition-all',
                  pagination.page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-primary-green hover:to-green-600 hover:text-white shadow-md'
                ]"
              >
                ← Précédent
              </button>

              <!-- Pages -->
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-4 py-3 rounded-xl font-semibold transition-all min-w-[48px]',
                  page === pagination.page
                    ? 'bg-gradient-to-r from-primary-green to-green-600 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                ]"
              >
                {{ page }}
              </button>

              <!-- Next -->
              <button
                @click="goToPage(pagination.page + 1)"
                :disabled="pagination.page === pagination.pages"
                :class="[
                  'px-5 py-3 rounded-xl font-semibold transition-all',
                  pagination.page === pagination.pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-primary-blue hover:to-blue-600 hover:text-white shadow-md'
                ]"
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
import { ref, computed, onMounted, watch } from 'vue'
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
const displayCounter = ref(0)

const filters = ref({
  country: null,
  type: null,
  category: null,
  energy: null,
  verified: false,
  featured: false
})

// Actor types with icons
const actorTypes = [
  { value: 'institution_publique', label: 'Institution', icon: '🏛️' },
  { value: 'entreprise', label: 'Entreprise', icon: '🏢' },
  { value: 'ong', label: 'ONG', icon: '🤝' },
  { value: 'universite', label: 'Université', icon: '🎓' },
  { value: 'association', label: 'Association', icon: '👥' },
  { value: 'cooperative', label: 'Coopérative', icon: '🌾' }
]

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

// Counter animation
const animateCounter = (target) => {
  const duration = 1500
  const increment = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      displayCounter.value = target
      clearInterval(timer)
    } else {
      displayCounter.value = Math.floor(current)
    }
  }, 16)
}

// Watch for pagination total changes to animate counter
watch(() => pagination.value.total, (newTotal) => {
  animateCounter(newTotal)
}, { immediate: true })

// Toggle filter methods
const toggleCountryFilter = (countryId) => {
  filters.value.country = countryId
  applyFilters()
}

const toggleTypeFilter = (type) => {
  filters.value.type = type
  applyFilters()
}

const toggleEnergyFilter = (energyId) => {
  filters.value.energy = energyId
  applyFilters()
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
/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes counter {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out backwards;
}

.animate-counter {
  animation: counter 0.5s ease-out;
}

/* Glassmorphism effects */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Hover effects for filters */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
