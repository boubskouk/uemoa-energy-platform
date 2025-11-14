<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        {{ isEditing ? 'Modifier l\'événement' : 'Créer un événement' }}
      </h1>
      <p class="text-gray-600">{{ isEditing ? 'Modifiez' : 'Ajoutez' }} les informations de votre événement</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Titre -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Titre</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre (Français) *</label>
            <input
              v-model="form.title.fr"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Titre en français"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre (English)</label>
            <input
              v-model="form.title.en"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Title in English"
            />
          </div>
        </div>
      </div>

      <!-- Type et Statut -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Type et Statut</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select
              v-model="form.type"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              <option value="">Sélectionnez un type</option>
              <option value="conference">Conférence</option>
              <option value="workshop">Atelier</option>
              <option value="webinar">Webinaire</option>
              <option value="forum">Forum</option>
              <option value="training">Formation</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              <option value="upcoming">À venir</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Dates et Horaires -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Dates et Horaires</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
            <input
              v-model="form.startDate"
              type="datetime-local"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
            <input
              v-model="form.endDate"
              type="datetime-local"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date limite d'inscription</label>
            <input
              v-model="form.registrationDeadline"
              type="datetime-local"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Lieu -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Lieu</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de lieu *</label>
              <select
                v-model="form.location.type"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="physical">Physique</option>
                <option value="online">En ligne</option>
                <option value="hybrid">Hybride</option>
              </select>
            </div>

            <div v-if="form.location.type !== 'online'">
              <label class="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
              <select
                v-model="form.location.country"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">Sélectionnez un pays</option>
                <option value="Bénin">Bénin</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Guinée-Bissau">Guinée-Bissau</option>
                <option value="Mali">Mali</option>
                <option value="Niger">Niger</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Togo">Togo</option>
              </select>
            </div>
          </div>

          <div v-if="form.location.type !== 'online'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
              <input
                v-model="form.location.city"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Ville"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <input
                v-model="form.location.address"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Adresse complète"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom du lieu</label>
            <input
              v-model="form.location.venue"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Ex: Hôtel Radisson, Centre de Conférence..."
            />
          </div>

          <div v-if="form.location.type !== 'physical'">
            <label class="block text-sm font-medium text-gray-700 mb-2">Lien en ligne</label>
            <input
              v-model="form.onlineLink"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="https://zoom.us/..."
            />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Description</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description courte (Français)</label>
            <textarea
              v-model="form.description.fr"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Résumé court de l'événement"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contenu détaillé (Français) *</label>
            <textarea
              v-model="form.content.fr"
              rows="10"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Description complète de l'événement, programme, intervenants..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Inscription et Capacité -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Inscription et Capacité</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input
                v-model="form.requiresRegistration"
                type="checkbox"
                class="w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-2 focus:ring-primary-blue"
              />
              <span class="text-sm font-medium text-gray-700">Inscription obligatoire</span>
            </label>

            <label class="flex items-center gap-2">
              <input
                v-model="form.isPaid"
                type="checkbox"
                class="w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-2 focus:ring-primary-blue"
              />
              <span class="text-sm font-medium text-gray-700">Événement payant</span>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Capacité maximale</label>
              <input
                v-model.number="form.capacity"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Nombre de participants max"
              />
            </div>

            <div v-if="form.isPaid">
              <label class="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="Prix en FCFA"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Organisateurs et Partenaires -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Organisateurs et Partenaires</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Organisateur principal</label>
            <input
              v-model="form.organizer"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="Nom de l'organisateur"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
            <input
              v-model="form.contactEmail"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone de contact</label>
            <input
              v-model="form.contactPhone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="+229 XX XX XX XX"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-semibold disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>

        <router-link
          to="/admin/events"
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Annuler
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../../../stores/events'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)

const form = ref({
  title: { fr: '', en: '' },
  description: { fr: '', en: '' },
  content: { fr: '', en: '' },
  type: '',
  status: 'upcoming',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  location: {
    type: 'physical',
    country: '',
    city: '',
    address: '',
    venue: ''
  },
  onlineLink: '',
  requiresRegistration: true,
  isPaid: false,
  capacity: null,
  price: null,
  organizer: '',
  contactEmail: '',
  contactPhone: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await eventsStore.updateEvent(route.params.id, form.value)
      alert('Événement mis à jour avec succès')
    } else {
      await eventsStore.createEvent(form.value)
      alert('Événement créé avec succès')
    }
    router.push('/admin/events')
  } catch (error) {
    alert('Erreur lors de l\'enregistrement')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    loading.value = true
    try {
      const event = await eventsStore.fetchEventById(route.params.id)
      if (event) {
        form.value = {
          title: event.title || { fr: '', en: '' },
          description: event.description || { fr: '', en: '' },
          content: event.content || { fr: '', en: '' },
          type: event.type || '',
          status: event.status || 'upcoming',
          startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
          endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
          registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : '',
          location: event.location || { type: 'physical', country: '', city: '', address: '', venue: '' },
          onlineLink: event.onlineLink || '',
          requiresRegistration: event.requiresRegistration !== false,
          isPaid: event.isPaid || false,
          capacity: event.capacity || null,
          price: event.price || null,
          organizer: event.organizer || '',
          contactEmail: event.contactEmail || '',
          contactPhone: event.contactPhone || ''
        }
      }
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
