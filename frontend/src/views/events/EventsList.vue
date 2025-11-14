<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-4xl font-heading font-bold text-gray-900 mb-4">
          Événements
        </h1>
        <p class="text-lg text-gray-600">
          Participez aux événements dédiés à l'énergie dans l'espace UEMOA
        </p>
      </div>

      <!-- Événements à venir en vedette -->
      <div v-if="upcomingEvents.length > 0" class="mb-12">
        <h2 class="text-2xl font-heading font-bold text-gray-800 mb-6">
          📅 Événements à venir
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard
            v-for="event in upcomingEvents"
            :key="event._id"
            :event="event"
          />
        </div>
      </div>

      <!-- Événements en cours -->
      <div v-if="ongoingEvents.length > 0" class="mb-12">
        <h2 class="text-2xl font-heading font-bold text-gray-800 mb-6">
          🔴 Événements en cours
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard
            v-for="event in ongoingEvents"
            :key="event._id"
            :event="event"
          />
        </div>
      </div>

      <!-- Contenu principal avec filtres -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar avec filtres -->
        <aside class="lg:col-span-1">
          <EventsFilters
            :initial-filters="filters"
            @update:filters="handleFiltersUpdate"
          />
        </aside>

        <!-- Liste de tous les événements -->
        <main class="lg:col-span-3">
          <h2 class="text-2xl font-heading font-bold text-gray-800 mb-6">
            Tous les événements
          </h2>

          <!-- État de chargement -->
          <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>

          <!-- Message d'erreur -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p class="text-red-600">{{ error }}</p>
            <button
              @click="loadEvents"
              class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>

          <!-- Aucun résultat -->
          <div v-else-if="!loading && eventsList.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
            <span class="text-6xl mb-4 block">📅</span>
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              Aucun événement trouvé
            </h3>
            <p class="text-gray-600">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>

          <!-- Grille des événements -->
          <div v-else>
            <div class="mb-6">
              <p class="text-sm text-gray-600">
                {{ pagination.total }} événement{{ pagination.total > 1 ? 's' : '' }} trouvé{{ pagination.total > 1 ? 's' : '' }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <EventCard
                v-for="event in eventsList"
                :key="event._id"
                :event="event"
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
import { useEventsStore } from '../../stores/events'
import EventCard from '../../components/events/EventCard.vue'
import EventsFilters from '../../components/events/EventsFilters.vue'
import Pagination from '../../components/common/Pagination.vue'

const eventsStore = useEventsStore()

// State réactifs du store
const eventsList = computed(() => eventsStore.events)
const upcomingEvents = computed(() => eventsStore.upcomingEvents)
const ongoingEvents = computed(() => eventsStore.ongoingEvents)
const loading = computed(() => eventsStore.loading)
const error = computed(() => eventsStore.error)
const pagination = computed(() => eventsStore.pagination)

// Filtres locaux
const filters = ref({
  search: '',
  category: null,
  country: null,
  locationType: null,
  upcoming: null,
  featured: null
})

// Charger les événements
const loadEvents = async () => {
  try {
    await eventsStore.fetchEvents()
  } catch (err) {
    console.error('Erreur lors du chargement des événements:', err)
  }
}

// Charger les événements à venir
const loadUpcomingEvents = async () => {
  try {
    await eventsStore.fetchUpcomingEvents(3)
  } catch (err) {
    console.error('Erreur lors du chargement des événements à venir:', err)
  }
}

// Charger les événements en cours
const loadOngoingEvents = async () => {
  try {
    await eventsStore.fetchOngoingEvents()
  } catch (err) {
    console.error('Erreur lors du chargement des événements en cours:', err)
  }
}

// Gérer la mise à jour des filtres
const handleFiltersUpdate = async (newFilters) => {
  filters.value = newFilters
  eventsStore.updateFilters(newFilters)
  eventsStore.setPage(1) // Retour à la page 1 lors du changement de filtres
  await loadEvents()
}

// Gérer le changement de page
const handlePageChange = async (page) => {
  eventsStore.setPage(page)
  await loadEvents()
  // Scroll vers le haut
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Chargement initial
onMounted(() => {
  loadEvents()
  loadUpcomingEvents()
  loadOngoingEvents()
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
