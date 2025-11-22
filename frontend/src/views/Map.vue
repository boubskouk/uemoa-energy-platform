<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-green to-primary-blue text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-heading font-bold mb-2">
          Carte Interactive
        </h1>
        <p class="text-white/90">
          Visualisez tous les acteurs des énergies renouvelables sur la carte
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filters Sidebar -->
        <aside class="lg:w-80 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Filtres</h2>
              <button
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="text-sm text-primary-green hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            <!-- Country Filter -->
            <div class="mb-4">
              <label class="text-sm font-semibold text-gray-700 mb-2 block">Pays</label>
              <select
                v-model="filters.country"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green text-sm"
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

            <!-- Energy Filter -->
            <div class="mb-4">
              <label class="text-sm font-semibold text-gray-700 mb-2 block">Type d'énergie</label>
              <select
                v-model="filters.energy"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green text-sm"
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

            <!-- Type Filter -->
            <div class="mb-4">
              <label class="text-sm font-semibold text-gray-700 mb-2 block">Type d'acteur</label>
              <select
                v-model="filters.type"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green text-sm"
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

            <!-- Options -->
            <div class="mb-4">
              <label class="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  v-model="filters.verified"
                  @change="applyFilters"
                  type="checkbox"
                  class="w-4 h-4 text-primary-green border-gray-300 rounded"
                />
                <span class="text-sm text-gray-700">Vérifiés uniquement</span>
              </label>
            </div>

            <!-- Stats -->
            <div class="pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                <span class="font-bold text-gray-900">{{ filteredActors.length }}</span>
                {{ filteredActors.length > 1 ? 'acteurs affichés' : 'acteur affiché' }}
              </p>
            </div>
          </div>
        </aside>

        <!-- Map Container -->
        <main class="flex-1">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Loading -->
            <div v-if="loading" class="h-[600px] flex items-center justify-center">
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
                <p class="text-gray-600">Chargement de la carte...</p>
              </div>
            </div>

            <!-- Map -->
            <div v-else class="h-[600px]">
              <MapView
                :actors="filteredActors"
                :center="mapCenter"
                :zoom="5"
                @marker-click="onMarkerClick"
              />
            </div>

            <!-- Legend -->
            <div class="p-4 border-t border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-primary-green rounded-full"></div>
                    <span class="text-sm text-gray-600">Acteur</span>
                  </div>
                </div>
                <router-link
                  to="/actors"
                  class="text-sm text-primary-green hover:underline font-semibold"
                >
                  Voir la liste complète →
                </router-link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Selected Actor Modal/Sidebar (optionnel) -->
    <div
      v-if="selectedActor"
      class="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-2xl p-6 z-50"
    >
      <button
        @click="selectedActor = null"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
      <h3 class="text-lg font-bold text-gray-900 mb-2">{{ selectedActor.name }}</h3>
      <p class="text-sm text-gray-600 mb-3">{{ selectedActor.type }}</p>
      <p class="text-sm text-gray-700 mb-4 line-clamp-3">
        {{ selectedActor.description?.fr || 'Aucune description' }}
      </p>
      <router-link
        :to="`/actors/${selectedActor._id}`"
        class="btn-primary w-full justify-center"
      >
        Voir le profil complet →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useActorsStore } from '@/stores/actors'
import { useReferenceStore } from '@/stores/reference'
import MapView from '@/components/map/MapView.vue'

const actorsStore = useActorsStore()
const referenceStore = useReferenceStore()

const loading = ref(true)
const selectedActor = ref(null)

const filters = ref({
  country: null,
  energy: null,
  type: null,
  verified: false
})

// Computed
const actors = computed(() => actorsStore.actors)
const countries = computed(() => referenceStore.countries)
const energies = computed(() => referenceStore.energies)

const filteredActors = computed(() => {
  return actors.value.filter(actor => {
    // Filtrer uniquement ceux qui ont des coordonnées
    if (!actor.location?.coordinates?.length) return false

    // Filtrer par pays
    if (filters.value.country && actor.country?._id !== filters.value.country) {
      return false
    }

    // Filtrer par énergie
    if (filters.value.energy) {
      const hasEnergy = actor.energies?.some(e => e._id === filters.value.energy)
      if (!hasEnergy) return false
    }

    // Filtrer par type
    if (filters.value.type && actor.type !== filters.value.type) {
      return false
    }

    // Filtrer par vérifié
    if (filters.value.verified && !actor.verified) {
      return false
    }

    return true
  })
})

const hasActiveFilters = computed(() => {
  return filters.value.country !== null ||
    filters.value.energy !== null ||
    filters.value.type !== null ||
    filters.value.verified
})

const mapCenter = computed(() => {
  // Centre de l'UEMOA (approximatif)
  return [12.6392, -8.0029]
})

// Methods
const applyFilters = async () => {
  // Les filtres sont appliqués automatiquement via computed
}

const resetFilters = () => {
  filters.value = {
    country: null,
    energy: null,
    type: null,
    verified: false
  }
}

const onMarkerClick = (actor) => {
  selectedActor.value = actor
}

// Lifecycle
onMounted(async () => {
  loading.value = true

  // Charger les références
  await referenceStore.fetchAll()

  // Charger tous les acteurs (sans pagination pour la carte)
  await actorsStore.fetchActors({ limit: 1000 })

  loading.value = false
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
