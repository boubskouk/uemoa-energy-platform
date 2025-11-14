<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <!-- Image de couverture -->
    <router-link :to="`/events/${event.slug}`" class="block relative overflow-hidden h-48">
      <img
        v-if="event.coverImage"
        :src="event.coverImage"
        :alt="event.title.fr"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span class="text-white text-6xl">📅</span>
      </div>

      <!-- Badge statut -->
      <div class="absolute top-3 left-3">
        <span :class="getStatusBadgeClass(event.status)">
          {{ getStatusLabel(event.status) }}
        </span>
      </div>

      <!-- Badge featured -->
      <div v-if="event.featured" class="absolute top-3 right-3">
        <span class="badge badge-featured">⭐ Vedette</span>
      </div>

      <!-- Badge type de localisation -->
      <div class="absolute bottom-3 left-3">
        <span class="badge badge-location">
          {{ getLocationIcon(event.location?.type) }} {{ getLocationType(event.location?.type) }}
        </span>
      </div>
    </router-link>

    <!-- Contenu -->
    <div class="p-5">
      <!-- Titre -->
      <router-link :to="`/events/${event.slug}`">
        <h3 class="text-xl font-heading font-bold text-gray-800 mb-3 hover:text-primary-blue transition-colors line-clamp-2">
          {{ event.title.fr }}
        </h3>
      </router-link>

      <!-- Date et lieu -->
      <div class="space-y-2 mb-4">
        <!-- Date -->
        <div class="flex items-center gap-2 text-gray-600">
          <span class="text-lg">📅</span>
          <span class="text-sm">{{ formatEventDate(event.startDate, event.endDate) }}</span>
        </div>

        <!-- Lieu -->
        <div class="flex items-center gap-2 text-gray-600">
          <span class="text-lg">{{ getLocationIcon(event.location?.type) }}</span>
          <span class="text-sm line-clamp-1">
            {{ getLocationText(event.location) }}
          </span>
        </div>

        <!-- Organisateur -->
        <div v-if="event.organizer?.name" class="flex items-center gap-2 text-gray-600">
          <span class="text-lg">👥</span>
          <span class="text-sm">{{ event.organizer.name }}</span>
        </div>
      </div>

      <!-- Catégorie -->
      <div class="mb-4">
        <span class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
          {{ getCategoryLabel(event.category) }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <!-- Vues -->
          <span class="flex items-center gap-1">
            👁️ {{ event.views || 0 }}
          </span>

          <!-- Intéressés -->
          <span class="flex items-center gap-1">
            ⭐ {{ event.interestedCount || 0 }} intéressés
          </span>
        </div>

        <!-- Bouton voir détails -->
        <router-link
          :to="`/events/${event.slug}`"
          class="text-primary-blue hover:text-primary-green font-semibold text-sm"
        >
          Voir détails →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const getStatusLabel = (status) => {
  const labels = {
    upcoming: 'À venir',
    ongoing: 'En cours',
    past: 'Terminé',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    upcoming: 'badge bg-green-500 text-white',
    ongoing: 'badge bg-blue-500 text-white',
    past: 'badge bg-gray-500 text-white',
    cancelled: 'badge bg-red-500 text-white'
  }
  return classes[status] || 'badge bg-gray-500 text-white'
}

const getCategoryLabel = (category) => {
  const labels = {
    conference: 'Conférence',
    workshop: 'Atelier',
    webinar: 'Webinaire',
    fair: 'Salon',
    training: 'Formation'
  }
  return labels[category] || category
}

const getLocationType = (type) => {
  const types = {
    physical: 'Présentiel',
    online: 'En ligne',
    hybrid: 'Hybride'
  }
  return types[type] || 'Présentiel'
}

const getLocationIcon = (type) => {
  const icons = {
    physical: '📍',
    online: '💻',
    hybrid: '🌐'
  }
  return icons[type] || '📍'
}

const getLocationText = (location) => {
  if (!location) return 'Lieu non spécifié'

  if (location.type === 'online') {
    return 'Événement en ligne'
  }

  if (location.venue) {
    const parts = [location.venue]
    if (location.city) parts.push(location.city)
    if (location.country?.name?.fr) parts.push(location.country.name.fr)
    return parts.join(', ')
  }

  return location.city || location.country?.name?.fr || 'Lieu à définir'
}

const formatEventDate = (startDate, endDate) => {
  if (!startDate) return ''

  const start = new Date(startDate)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }

  if (!endDate) {
    return start.toLocaleDateString('fr-FR', options)
  }

  const end = new Date(endDate)
  const startStr = start.toLocaleDateString('fr-FR', options)

  // Si même jour
  if (start.toDateString() === end.toDateString()) {
    return startStr
  }

  // Différents jours
  const endStr = end.toLocaleDateString('fr-FR', options)
  return `${startStr} - ${endStr}`
}
</script>

<style scoped>
.badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
}

.badge-featured {
  @apply bg-yellow-400 text-gray-900;
}

.badge-location {
  @apply bg-white/90 backdrop-blur-sm text-gray-800;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
