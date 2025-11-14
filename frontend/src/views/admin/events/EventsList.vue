<template>
  <div class="space-y-6">
    <!-- En-tête avec actions -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des Événements</h1>
        <p class="text-gray-600">Gérez tous vos événements depuis cette interface</p>
      </div>
      <router-link
        to="/admin/events/create"
        class="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvel événement
      </router-link>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Recherche -->
        <div class="md:col-span-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un événement..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
        </div>

        <!-- Filtre statut -->
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
        >
          <option value="">Tous les statuts</option>
          <option value="upcoming">À venir</option>
          <option value="ongoing">En cours</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>

        <!-- Filtre type -->
        <select
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
        >
          <option value="">Tous les types</option>
          <option value="conference">Conférence</option>
          <option value="workshop">Atelier</option>
          <option value="webinar">Webinaire</option>
          <option value="forum">Forum</option>
          <option value="training">Formation</option>
        </select>
      </div>
    </div>

    <!-- Tableau des événements -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto"></div>
      </div>

      <!-- Liste -->
      <div v-else-if="eventsList.length > 0">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Événement</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lieu</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="event in eventsList"
              :key="event._id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Événement -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div v-if="event.coverImage" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="event.coverImage" :alt="event.title.fr" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ event.title.fr }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ event.description?.fr || 'Pas de description' }}</p>
                  </div>
                </div>
              </td>

              <!-- Type -->
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  {{ getTypeLabel(event.type) }}
                </span>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 text-gray-600 text-sm">
                <div>
                  <p class="font-medium">{{ formatDate(event.startDate) }}</p>
                  <p class="text-xs text-gray-500">{{ formatTime(event.startDate) }}</p>
                </div>
              </td>

              <!-- Lieu -->
              <td class="px-6 py-4 text-gray-600 text-sm">
                <div>
                  <p class="font-medium">{{ event.location?.city }}</p>
                  <p class="text-xs text-gray-500">{{ event.location?.country }}</p>
                </div>
              </td>

              <!-- Statut -->
              <td class="px-6 py-4">
                <span :class="getStatusBadge(event.status)">
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>

              <!-- Participants -->
              <td class="px-6 py-4 text-gray-600">
                <div class="text-center">
                  <p class="font-medium">{{ event.registrations?.length || 0 }}</p>
                  <p class="text-xs text-gray-500">/ {{ event.capacity || '∞' }}</p>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/admin/events/edit/${event._id}`"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </router-link>

                  <button
                    @click="deleteEvent(event._id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <router-link
                    :to="`/events/${event.slug}`"
                    target="_blank"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Voir"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>

                  <button
                    @click="viewRegistrations(event._id)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Voir les inscriptions"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-else class="p-12 text-center">
        <span class="text-6xl mb-4 block">📅</span>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          Aucun événement
        </h3>
        <p class="text-gray-600 mb-6">
          Commencez par créer votre premier événement
        </p>
        <router-link
          to="/admin/events/create"
          class="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-semibold"
        >
          Créer un événement
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventsStore } from '../../../stores/events'
import { useRouter } from 'vue-router'

const eventsStore = useEventsStore()
const router = useRouter()

const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const loading = ref(false)

const eventsList = computed(() => eventsStore.events)

const getTypeLabel = (type) => {
  const labels = {
    conference: 'Conférence',
    workshop: 'Atelier',
    webinar: 'Webinaire',
    forum: 'Forum',
    training: 'Formation'
  }
  return labels[type] || type
}

const getStatusLabel = (status) => {
  const labels = {
    upcoming: 'À venir',
    ongoing: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getStatusBadge = (status) => {
  const classes = {
    upcoming: 'px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full',
    ongoing: 'px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full',
    completed: 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full',
    cancelled: 'px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'
  }
  return classes[status] || 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const deleteEvent = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return

  try {
    await eventsStore.deleteEvent(id)
    alert('Événement supprimé avec succès')
  } catch (error) {
    alert('Erreur lors de la suppression')
  }
}

const viewRegistrations = (id) => {
  // TODO: Implémenter la vue des inscriptions
  router.push(`/admin/events/${id}/registrations`)
}

onMounted(async () => {
  loading.value = true
  try {
    await eventsStore.fetchEvents()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
