<template>
  <div class="min-h-screen bg-gray-50">
    <!-- État de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <router-link
          to="/events"
          class="inline-block px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
        >
          Retour aux événements
        </router-link>
      </div>
    </div>

    <!-- Contenu de l'événement -->
    <article v-else-if="event" class="pb-12">
      <!-- Image de couverture -->
      <div class="relative h-96 bg-gradient-to-br from-blue-500 to-purple-600">
        <img
          v-if="event.coverImage"
          :src="event.coverImage"
          :alt="event.title.fr"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/30"></div>

        <!-- Badges et titre sur l'image -->
        <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div class="container mx-auto">
            <div class="mb-4 flex flex-wrap gap-2 items-center">
              <span :class="getStatusBadgeClass(event.status)">
                {{ getStatusLabel(event.status) }}
              </span>
              <span class="badge bg-white/90 text-gray-800">
                {{ getCategoryLabel(event.category) }}
              </span>
              <span v-if="event.featured" class="badge bg-yellow-400 text-gray-900">
                ⭐ Vedette
              </span>
              <span class="badge bg-white/90 text-gray-800">
                {{ getLocationIcon(event.location?.type) }} {{ getLocationType(event.location?.type) }}
              </span>
            </div>
            <h1 class="text-4xl md:text-5xl font-heading font-bold mb-4">
              {{ event.title.fr }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="container mx-auto px-4 -mt-8">
        <div class="max-w-4xl mx-auto">
          <!-- Carte d'informations principales -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Date -->
              <div class="flex items-start gap-3">
                <span class="text-2xl">📅</span>
                <div>
                  <p class="font-semibold text-gray-800">Date</p>
                  <p class="text-gray-600">{{ formatEventDate(event.startDate, event.endDate) }}</p>
                </div>
              </div>

              <!-- Lieu -->
              <div class="flex items-start gap-3">
                <span class="text-2xl">{{ getLocationIcon(event.location?.type) }}</span>
                <div>
                  <p class="font-semibold text-gray-800">Lieu</p>
                  <p class="text-gray-600">{{ getLocationText(event.location) }}</p>
                </div>
              </div>

              <!-- Organisateur -->
              <div v-if="event.organizer?.name" class="flex items-start gap-3">
                <span class="text-2xl">👥</span>
                <div>
                  <p class="font-semibold text-gray-800">Organisateur</p>
                  <p class="text-gray-600">{{ event.organizer.name }}</p>
                  <a
                    v-if="event.organizer.website"
                    :href="event.organizer.website"
                    target="_blank"
                    class="text-primary-blue hover:underline text-sm"
                  >
                    Site web →
                  </a>
                </div>
              </div>

              <!-- Contact -->
              <div v-if="event.organizer?.email" class="flex items-start gap-3">
                <span class="text-2xl">📧</span>
                <div>
                  <p class="font-semibold text-gray-800">Contact</p>
                  <a
                    :href="`mailto:${event.organizer.email}`"
                    class="text-primary-blue hover:underline text-sm"
                  >
                    {{ event.organizer.email }}
                  </a>
                  <p v-if="event.organizer.phone" class="text-gray-600 text-sm">
                    {{ event.organizer.phone }}
                  </p>
                </div>
              </div>

              <!-- Vues et intéressés -->
              <div class="flex items-start gap-3">
                <span class="text-2xl">📊</span>
                <div>
                  <p class="font-semibold text-gray-800">Statistiques</p>
                  <p class="text-gray-600 text-sm">👁️ {{ event.views || 0 }} vues</p>
                  <p class="text-gray-600 text-sm">⭐ {{ event.interestedCount || 0 }} intéressés</p>
                </div>
              </div>
            </div>

            <!-- Bouton d'inscription -->
            <div v-if="event.status === 'upcoming' && event.registrationUrl" class="mt-6 pt-6 border-t">
              <a
                :href="event.registrationUrl"
                target="_blank"
                class="block w-full md:w-auto text-center px-8 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-bold text-lg"
              >
                S'inscrire à l'événement →
              </a>
              <p v-if="event.registrationDeadline" class="text-sm text-gray-600 mt-2">
                Date limite d'inscription : {{ formatDate(event.registrationDeadline) }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <div
              v-if="event.description?.fr"
              class="prose prose-lg max-w-none"
              v-html="formatContent(event.description.fr)"
            ></div>
            <p v-else class="text-gray-500 italic">
              Aucune description disponible
            </p>
          </div>

          <!-- Programme -->
          <div v-if="event.agenda && event.agenda.length > 0" class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Programme</h2>
            <div class="space-y-4">
              <div
                v-for="(item, index) in event.agenda"
                :key="index"
                class="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <div class="flex-shrink-0 w-20 text-primary-blue font-semibold">
                  {{ item.time }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{{ item.title.fr }}</h3>
                  <p v-if="item.description?.fr" class="text-gray-600 text-sm mt-1">
                    {{ item.description.fr }}
                  </p>
                  <p v-if="item.speaker" class="text-gray-500 text-sm mt-1">
                    🎤 {{ item.speaker }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Intervenants -->
          <div v-if="event.speakers && event.speakers.length > 0" class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Intervenants</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(speaker, index) in event.speakers"
                :key="index"
                class="flex gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div v-if="speaker.photo" class="flex-shrink-0">
                  <img
                    :src="speaker.photo"
                    :alt="speaker.name"
                    class="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{{ speaker.name }}</h3>
                  <p v-if="speaker.title" class="text-sm text-gray-600">{{ speaker.title }}</p>
                  <p v-if="speaker.organization" class="text-sm text-gray-500">{{ speaker.organization }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tarifs -->
          <div v-if="event.pricing && event.pricing.length > 0" class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Tarifs</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="(price, index) in event.pricing"
                :key="index"
                class="p-4 border-2 border-gray-200 rounded-lg text-center"
              >
                <h3 class="font-semibold text-gray-800 mb-2">{{ price.category }}</h3>
                <p class="text-3xl font-bold text-primary-blue mb-2">
                  {{ price.amount === 0 ? 'Gratuit' : `${price.amount} ${price.currency || 'FCFA'}` }}
                </p>
                <p v-if="price.description" class="text-sm text-gray-600">
                  {{ price.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-wrap gap-4">
            <router-link
              to="/events"
              class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ← Retour aux événements
            </router-link>
            <button
              @click="toggleInterested"
              class="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium"
            >
              ⭐ Je suis intéressé
            </button>
            <button
              @click="shareEvent"
              class="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium"
            >
              Partager 🔗
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../../stores/events'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

const event = computed(() => eventsStore.currentEvent)
const loading = computed(() => eventsStore.loading)
const error = computed(() => eventsStore.error)

// Charger l'événement
const loadEvent = async () => {
  try {
    const identifier = route.params.slug || route.params.id

    // Vérifier que l'identifiant est valide
    if (!identifier || identifier === 'undefined' || identifier === 'null') {
      console.error('Identifiant invalide:', identifier)
      router.push('/events')
      return
    }

    await eventsStore.fetchEventById(identifier)
  } catch (err) {
    console.error('Erreur lors du chargement de l\'événement:', err)
  }
}

// Formater la date
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Formater les dates de l'événement
const formatEventDate = (startDate, endDate) => {
  if (!startDate) return ''

  const start = new Date(startDate)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }

  if (!endDate) {
    return start.toLocaleDateString('fr-FR', options)
  }

  const end = new Date(endDate)
  const startStr = start.toLocaleDateString('fr-FR', options)

  if (start.toDateString() === end.toDateString()) {
    return startStr
  }

  const endStr = end.toLocaleDateString('fr-FR', options)
  return `${startStr} - ${endStr}`
}

// Formater le contenu
const formatContent = (content) => {
  if (!content) return ''
  return content
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

// Obtenir le label de statut
const getStatusLabel = (status) => {
  const labels = {
    upcoming: 'À venir',
    ongoing: 'En cours',
    past: 'Terminé',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}

// Obtenir la classe CSS du badge de statut
const getStatusBadgeClass = (status) => {
  const classes = {
    upcoming: 'badge bg-green-500 text-white',
    ongoing: 'badge bg-blue-500 text-white',
    past: 'badge bg-gray-500 text-white',
    cancelled: 'badge bg-red-500 text-white'
  }
  return classes[status] || 'badge bg-gray-500 text-white'
}

// Obtenir le label de catégorie
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

// Obtenir le type de localisation
const getLocationType = (type) => {
  const types = {
    physical: 'Présentiel',
    online: 'En ligne',
    hybrid: 'Hybride'
  }
  return types[type] || 'Présentiel'
}

// Obtenir l'icône de localisation
const getLocationIcon = (type) => {
  const icons = {
    physical: '📍',
    online: '💻',
    hybrid: '🌐'
  }
  return icons[type] || '📍'
}

// Obtenir le texte de localisation
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

// Marquer l'intérêt
const toggleInterested = async () => {
  try {
    await eventsStore.markInterested(event.value._id)
    alert('Merci de votre intérêt ! Vous serez informé des mises à jour.')
  } catch (err) {
    console.error('Erreur:', err)
    alert('Une erreur est survenue. Veuillez réessayer.')
  }
}

// Partager l'événement
const shareEvent = () => {
  if (navigator.share) {
    navigator.share({
      title: event.value.title.fr,
      text: event.value.description?.fr || '',
      url: window.location.href
    }).catch(err => console.error('Erreur de partage:', err))
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié dans le presse-papier!')
  }
}

// Chargement initial
onMounted(() => {
  loadEvent()
})
</script>

<style scoped>
.badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
}

.prose {
  @apply text-gray-700;
}

.prose p {
  @apply mb-4;
}

.prose h2 {
  @apply text-2xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-bold text-gray-900 mt-6 mb-3;
}

.prose ul,
.prose ol {
  @apply ml-6 mb-4;
}

.prose li {
  @apply mb-2;
}

.prose a {
  @apply text-primary-blue hover:underline;
}
</style>
