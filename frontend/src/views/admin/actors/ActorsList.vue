<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Acteurs</h1>
        <p class="text-gray-600 mt-1">Gérer et modérer les acteurs de la plateforme</p>
      </div>
      <router-link
        to="/admin/actors/create"
        class="btn-gradient flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un acteur
      </router-link>
    </div>

    <!-- Filtres et recherche -->
    <div class="card-glass">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Rechercher..."
          class="input-modern"
        />
        <select v-model="filters.country" class="input-modern">
          <option :value="null">Tous les pays</option>
          <option v-for="country in countries" :key="country.code" :value="country.code">
            {{ country.flag }} {{ country.name.fr }}
          </option>
        </select>
        <select v-model="filters.status" class="input-modern">
          <option :value="null">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvé</option>
          <option value="rejected">Rejeté</option>
        </select>
        <select v-model="filters.verified" class="input-modern">
          <option :value="null">Tous</option>
          <option :value="true">Vérifiés</option>
          <option :value="false">Non vérifiés</option>
        </select>
      </div>
    </div>

    <!-- Tableau des acteurs -->
    <div class="card-modern">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acteur</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pays</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="actor in actors" :key="actor._id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="actor.images?.logo"
                    :src="actor.images.logo"
                    :alt="actor.name"
                    class="w-10 h-10 rounded-lg object-cover"
                  />
                  <div class="w-10 h-10 bg-gradient-uemoa rounded-lg flex items-center justify-center text-white font-bold" v-else>
                    {{ actor.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ actor.name }}</p>
                    <p class="text-sm text-gray-500">{{ actor.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="actor.country">
                  {{ actor.country.flag }} {{ actor.country.name.fr }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="badge badge-blue">
                  {{ getTypeLabel(actor.type) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadge(actor.status)">
                  {{ getStatusLabel(actor.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(actor.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/actors/${actor._id}`"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <router-link
                    :to="`/admin/actors/edit/${actor._id}`"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </router-link>
                  <button
                    v-if="actor.status === 'pending'"
                    @click="approveActor(actor._id)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Approuver"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    @click="deleteActor(actor._id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t">
        <p class="text-sm text-gray-600">
          Affichage {{ (page - 1) * limit + 1 }} à {{ Math.min(page * limit, total) }} sur {{ total }} acteurs
        </p>
        <div class="flex gap-2">
          <button
            @click="goToPage(page - 1)"
            :disabled="page === 1"
            class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>
          <button
            @click="goToPage(page + 1)"
            :disabled="page >= totalPages"
            class="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useReferenceStore } from '@/stores/reference'
import api from '@/services/api'

const referenceStore = useReferenceStore()

const actors = ref([])
const countries = ref([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)
const totalPages = ref(0)

const filters = ref({
  search: '',
  country: null,
  status: null,
  verified: null
})

const getTypeLabel = (type) => {
  const labels = {
    company: 'Entreprise',
    ngo: 'ONG',
    association: 'Association',
    institution: 'Institution',
    startup: 'Startup',
    cooperative: 'Coopérative'
  }
  return labels[type] || type
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté'
  }
  return labels[status] || status
}

const getStatusBadge = (status) => {
  const badges = {
    pending: 'badge bg-yellow-100 text-yellow-800',
    approved: 'badge bg-green-100 text-green-800',
    rejected: 'badge bg-red-100 text-red-800'
  }
  return badges[status] || 'badge bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadActors = async () => {
  try {
    const params = {
      page: page.value,
      limit: limit.value
    }

    if (filters.value.search) params.search = filters.value.search
    if (filters.value.country) params.country = filters.value.country
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.verified !== null) params.verified = filters.value.verified

    const response = await api.get('/actors', { params })

    actors.value = response.data.actors || []
    total.value = response.data.pagination?.total || 0
    totalPages.value = response.data.pagination?.totalPages || 0
  } catch (error) {
    console.error('Erreur chargement acteurs:', error)
  }
}

const goToPage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    loadActors()
  }
}

const approveActor = async (actorId) => {
  if (!confirm('Voulez-vous approuver cet acteur ?')) return

  try {
    await api.patch(`/actors/${actorId}/status`, { status: 'approved' })
    loadActors()
  } catch (error) {
    console.error('Erreur approbation acteur:', error)
    alert('Erreur lors de l\'approbation de l\'acteur')
  }
}

const deleteActor = async (actorId) => {
  if (!confirm('Voulez-vous vraiment supprimer cet acteur ? Cette action est irréversible.')) return

  try {
    await api.delete(`/actors/${actorId}`)
    loadActors()
  } catch (error) {
    console.error('Erreur suppression acteur:', error)
    alert('Erreur lors de la suppression de l\'acteur')
  }
}

watch(filters, () => {
  page.value = 1
  loadActors()
}, { deep: true })

onMounted(async () => {
  await referenceStore.fetchAll()
  countries.value = referenceStore.countries
  loadActors()
})
</script>
