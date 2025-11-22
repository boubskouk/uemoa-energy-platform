<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
      <p class="text-gray-600 mt-1">Gérer et modérer les utilisateurs de la plateforme</p>
    </div>

    <!-- Filtres -->
    <div class="card-glass">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Rechercher par nom ou email..."
          class="input-modern"
        />
        <select v-model="filters.role" class="input-modern">
          <option :value="null">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="user">Utilisateur</option>
        </select>
        <select v-model="filters.status" class="input-modern">
          <option :value="null">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvé</option>
          <option value="rejected">Rejeté</option>
        </select>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card-glass">
        <p class="text-sm text-gray-600">Total Utilisateurs</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
      </div>
      <div class="card-glass">
        <p class="text-sm text-gray-600">En attente</p>
        <p class="text-3xl font-bold text-yellow-600 mt-2">{{ stats.pending }}</p>
      </div>
      <div class="card-glass">
        <p class="text-sm text-gray-600">Approuvés</p>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.approved }}</p>
      </div>
      <div class="card-glass">
        <p class="text-sm text-gray-600">Administrateurs</p>
        <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.admins }}</p>
      </div>
    </div>

    <!-- Tableau des utilisateurs -->
    <div class="card-modern">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Utilisateur</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Organisation</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rôle</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inscription</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-purple-blue rounded-full flex items-center justify-center text-white font-bold">
                    {{ getUserInitials(user) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ user.organization || '-' }}
              </td>
              <td class="px-6 py-4">
                <span :class="getRoleBadge(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadge(user.status)">
                  {{ getStatusLabel(user.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="user.status === 'pending'"
                    @click="approveUser(user._id)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Approuver"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    v-if="user.status === 'pending'"
                    @click="rejectUser(user._id)"
                    class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Rejeter"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    v-if="user.role !== 'admin'"
                    @click="toggleRole(user._id, user.role)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    :title="user.role === 'admin' ? 'Retirer admin' : 'Rendre admin'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteUser(user._id)"
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
          Affichage {{ (page - 1) * limit + 1 }} à {{ Math.min(page * limit, total) }} sur {{ total }} utilisateurs
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
import { ref, onMounted, watch, computed } from 'vue'
import api from '@/services/api'

const users = ref([])
const page = ref(1)
const limit = ref(20)
const total = ref(0)
const totalPages = ref(0)

const filters = ref({
  search: '',
  role: null,
  status: null
})

const stats = computed(() => {
  return {
    total: users.value.length,
    pending: users.value.filter(u => u.status === 'pending').length,
    approved: users.value.filter(u => u.status === 'approved').length,
    admins: users.value.filter(u => u.role === 'admin').length
  }
})

const getUserInitials = (user) => {
  return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
}

const getRoleLabel = (role) => {
  return role === 'admin' ? 'Administrateur' : 'Utilisateur'
}

const getRoleBadge = (role) => {
  return role === 'admin'
    ? 'badge bg-purple-100 text-purple-800'
    : 'badge bg-blue-100 text-blue-800'
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

const loadUsers = async () => {
  try {
    const params = {
      page: page.value,
      limit: limit.value
    }

    if (filters.value.search) params.search = filters.value.search
    if (filters.value.role) params.role = filters.value.role
    if (filters.value.status) params.status = filters.value.status

    const response = await api.get('/users', { params })

    users.value = response.data.users || []
    total.value = response.data.pagination?.total || 0
    totalPages.value = response.data.pagination?.totalPages || 0
  } catch (error) {
    console.error('Erreur chargement utilisateurs:', error)
  }
}

const goToPage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    loadUsers()
  }
}

const approveUser = async (userId) => {
  if (!confirm('Voulez-vous approuver cet utilisateur ?')) return

  try {
    await api.patch(`/users/${userId}/status`, { status: 'approved' })
    loadUsers()
  } catch (error) {
    console.error('Erreur approbation utilisateur:', error)
    alert('Erreur lors de l\'approbation de l\'utilisateur')
  }
}

const rejectUser = async (userId) => {
  if (!confirm('Voulez-vous rejeter cet utilisateur ?')) return

  try {
    await api.patch(`/users/${userId}/status`, { status: 'rejected' })
    loadUsers()
  } catch (error) {
    console.error('Erreur rejet utilisateur:', error)
    alert('Erreur lors du rejet de l\'utilisateur')
  }
}

const toggleRole = async (userId, currentRole) => {
  const newRole = currentRole === 'admin' ? 'user' : 'admin'
  const action = newRole === 'admin' ? 'administrateur' : 'utilisateur'

  if (!confirm(`Voulez-vous rendre cet utilisateur ${action} ?`)) return

  try {
    await api.patch(`/users/${userId}/role`, { role: newRole })
    loadUsers()
  } catch (error) {
    console.error('Erreur modification rôle:', error)
    alert('Erreur lors de la modification du rôle')
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.')) return

  try {
    await api.delete(`/users/${userId}`)
    loadUsers()
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error)
    alert('Erreur lors de la suppression de l\'utilisateur')
  }
}

watch(filters, () => {
  page.value = 1
  loadUsers()
}, { deep: true })

onMounted(() => {
  loadUsers()
})
</script>
