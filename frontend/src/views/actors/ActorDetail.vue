<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p class="text-gray-600">Chargement...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Acteur introuvable</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/actors" class="btn-primary">
          ← Retour à la liste
        </router-link>
      </div>
    </div>

    <!-- Actor Details -->
    <div v-else-if="actor" class="pb-12">
      <!-- Hero Section avec Cover -->
      <div class="relative h-64 bg-gradient-to-br from-primary-green to-primary-blue">
        <img
          v-if="actor.images?.coverImage"
          :src="actor.images.coverImage"
          :alt="actor.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div class="container mx-auto px-4">
        <!-- Header Card (overlapping) -->
        <div class="relative -mt-20 mb-8">
          <div class="bg-white rounded-lg shadow-xl p-6">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Logo -->
              <div class="flex-shrink-0">
                <div class="w-32 h-32 bg-white rounded-lg shadow-md overflow-hidden border-4 border-white">
                  <img
                    v-if="actor.images?.logo"
                    :src="actor.images.logo"
                    :alt="actor.name"
                    class="w-full h-full object-contain p-2"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-green to-primary-blue text-white text-4xl font-bold">
                    {{ actor.name.charAt(0) }}
                  </div>
                </div>
              </div>

              <!-- Infos principales -->
              <div class="flex-1">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 class="text-3xl font-heading font-bold text-gray-900 mb-2">
                      {{ actor.name }}
                    </h1>
                    <div class="flex flex-wrap items-center gap-3">
                      <!-- Type Badge -->
                      <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {{ getActorTypeLabel(actor.type) }}
                      </span>
                      <!-- Verified Badge -->
                      <span v-if="actor.verified" class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                        ✓ Vérifié
                      </span>
                      <!-- Featured Badge -->
                      <span v-if="actor.featured" class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center gap-1">
                        ⭐ En vedette
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2">
                    <button
                      @click="contactActor"
                      class="btn-primary flex items-center gap-2"
                    >
                      ✉️ Contacter
                    </button>
                    <button
                      @click="shareActor"
                      class="btn-secondary flex items-center gap-2"
                    >
                      🔗 Partager
                    </button>
                  </div>
                </div>

                <!-- Quick Info Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="flex items-center gap-2 text-gray-600">
                    <span class="text-xl">🌍</span>
                    <div>
                      <p class="text-xs text-gray-500">Pays</p>
                      <p class="font-semibold text-gray-900">{{ actor.country?.name?.fr || 'N/A' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <span class="text-xl">📍</span>
                    <div>
                      <p class="text-xs text-gray-500">Ville</p>
                      <p class="font-semibold text-gray-900">{{ actor.location?.city || 'N/A' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <span class="text-xl">👁️</span>
                    <div>
                      <p class="text-xs text-gray-500">Vues</p>
                      <p class="font-semibold text-gray-900">{{ actor.stats?.views || 0 }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <span class="text-xl">📧</span>
                    <div>
                      <p class="text-xs text-gray-500">Contacts</p>
                      <p class="font-semibold text-gray-900">{{ actor.stats?.contacts || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div class="flex border-b">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex-1 px-6 py-4 text-center font-semibold transition-colors',
                activeTab === tab.id
                  ? 'bg-primary-green text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              ]"
            >
              <span class="text-xl mr-2">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tabs Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Overview Tab -->
            <div v-show="activeTab === 'overview'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-4">Vue d'ensemble</h2>

              <!-- Description -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-3">Description</h3>
                <p class="text-gray-700 whitespace-pre-wrap">{{ actor.description?.fr || 'Aucune description disponible.' }}</p>
              </div>

              <!-- Activités -->
              <div v-if="actor.activities && actor.activities.length > 0" class="mb-6">
                <h3 class="text-lg font-semibold mb-3">Activités</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="activity in actor.activities"
                    :key="activity._id"
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {{ activity.name?.fr }}
                  </span>
                </div>
              </div>

              <!-- Énergies -->
              <div v-if="actor.energies && actor.energies.length > 0" class="mb-6">
                <h3 class="text-lg font-semibold mb-3">Types d'énergies</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div
                    v-for="energy in actor.energies"
                    :key="energy._id"
                    class="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                  >
                    <span class="text-2xl">{{ energy.icon }}</span>
                    <span class="font-medium text-gray-900">{{ energy.name?.fr }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Projects Tab -->
            <div v-show="activeTab === 'projects'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-4">Projets & Réalisations</h2>
              <p class="text-gray-600">Les projets seront affichés ici prochainement.</p>
            </div>

            <!-- Gallery Tab -->
            <div v-show="activeTab === 'gallery'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-4">Galerie Photos</h2>
              <div v-if="actor.images?.gallery && actor.images.gallery.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="(image, index) in actor.images.gallery"
                  :key="index"
                  class="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <img :src="image" :alt="`Photo ${index + 1}`" class="w-full h-full object-cover">
                </div>
              </div>
              <p v-else class="text-gray-600">Aucune photo disponible.</p>
            </div>

            <!-- Contact Tab -->
            <div v-show="activeTab === 'contact'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-4">Informations de Contact</h2>

              <div class="space-y-4">
                <!-- Email -->
                <div v-if="actor.contact?.email" class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">✉️</span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <a :href="`mailto:${actor.contact.email}`" class="text-primary-blue font-medium hover:underline">
                      {{ actor.contact.email }}
                    </a>
                  </div>
                </div>

                <!-- Phone -->
                <div v-if="actor.contact?.phone" class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">📞</span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Téléphone</p>
                    <a :href="`tel:${actor.contact.phone}`" class="text-primary-green font-medium hover:underline">
                      {{ actor.contact.phone }}
                    </a>
                  </div>
                </div>

                <!-- Website -->
                <div v-if="actor.contact?.website" class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">🌐</span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Site Web</p>
                    <a :href="actor.contact.website" target="_blank" class="text-purple-600 font-medium hover:underline">
                      {{ actor.contact.website }}
                    </a>
                  </div>
                </div>

                <!-- Address -->
                <div v-if="actor.location?.address" class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">📍</span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Adresse</p>
                    <p class="text-gray-900 font-medium">{{ actor.location.address }}</p>
                    <p class="text-gray-600">{{ actor.location.city }}, {{ actor.country?.name?.fr }}</p>
                  </div>
                </div>

                <!-- Social Media -->
                <div v-if="actor.contact?.socialMedia" class="pt-4 border-t">
                  <p class="text-sm text-gray-500 mb-3">Réseaux sociaux</p>
                  <div class="flex gap-3">
                    <a
                      v-if="actor.contact.socialMedia.facebook"
                      :href="actor.contact.socialMedia.facebook"
                      target="_blank"
                      class="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      f
                    </a>
                    <a
                      v-if="actor.contact.socialMedia.twitter"
                      :href="actor.contact.socialMedia.twitter"
                      target="_blank"
                      class="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                    >
                      𝕏
                    </a>
                    <a
                      v-if="actor.contact.socialMedia.linkedin"
                      :href="actor.contact.socialMedia.linkedin"
                      target="_blank"
                      class="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                    >
                      in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Map Card -->
            <div v-if="actor.location?.coordinates" class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-bold mb-4">Localisation</h3>
              <div class="h-64">
                <MapView
                  :actors="actorForMap"
                  :center="[actor.location.coordinates[1], actor.location.coordinates[0]]"
                  :zoom="13"
                  :single-marker="true"
                />
              </div>
              <p class="text-sm text-gray-600 mt-3 flex items-center gap-2">
                <span>📍</span>
                <span>{{ actor.location.city }}, {{ actor.country?.name?.fr }}</span>
              </p>
            </div>

            <!-- Quick Actions Card -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-bold mb-4">Actions rapides</h3>
              <div class="space-y-2">
                <button
                  @click="contactActor"
                  class="w-full btn-primary justify-center"
                >
                  ✉️ Envoyer un message
                </button>
                <button
                  @click="shareActor"
                  class="w-full btn-secondary justify-center"
                >
                  🔗 Partager ce profil
                </button>
                <button class="w-full btn-secondary justify-center">
                  💾 Enregistrer
                </button>
              </div>
            </div>

            <!-- Stats Card -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-bold mb-4">Statistiques</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">👁️ Vues</span>
                  <span class="font-bold text-gray-900">{{ actor.stats?.views || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">📧 Contacts</span>
                  <span class="font-bold text-gray-900">{{ actor.stats?.contacts || 0 }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">📅 Membre depuis</span>
                  <span class="font-bold text-gray-900">{{ formatDate(actor.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useActorsStore } from '@/stores/actors'
import MapView from '@/components/map/MapView.vue'

const route = useRoute()
const actorsStore = useActorsStore()

const actor = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('overview')

// Computed pour la carte
const actorForMap = computed(() => {
  if (!actor.value) return []
  return [actor.value]
})

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: '📋' },
  { id: 'projects', label: 'Projets', icon: '💼' },
  { id: 'gallery', label: 'Galerie', icon: '🖼️' },
  { id: 'contact', label: 'Contact', icon: '📞' }
]

const getActorTypeLabel = (type) => {
  const labels = {
    'company': 'Entreprise',
    'ngo': 'ONG',
    'association': 'Association',
    'institution': 'Institution',
    'startup': 'Startup',
    'cooperative': 'Coopérative'
  }
  return labels[type] || type
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })
}

const contactActor = () => {
  // Incrémenter le compteur de contacts
  if (actor.value?.contact?.email) {
    window.location.href = `mailto:${actor.value.contact.email}?subject=Contact depuis UEMOA Energy Platform`
  } else {
    alert('Aucune adresse email disponible')
  }
}

const shareActor = () => {
  if (navigator.share) {
    navigator.share({
      title: actor.value.name,
      text: `Découvrez ${actor.value.name} sur UEMOA Energy Platform`,
      url: window.location.href
    })
  } else {
    // Fallback: copier l'URL
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié dans le presse-papiers !')
  }
}

onMounted(async () => {
  const actorId = route.params.id
  loading.value = true

  const result = await actorsStore.fetchActorById(actorId)

  if (result.success) {
    actor.value = actorsStore.currentActor
  } else {
    error.value = result.error
  }

  loading.value = false
})
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>
