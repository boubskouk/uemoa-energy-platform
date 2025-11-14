<template>
  <div class="space-y-6">
    <!-- En-tête avec actions -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestion des Actualités</h1>
        <p class="text-gray-600">Gérez toutes vos actualités depuis cette interface</p>
      </div>
      <router-link
        to="/admin/news/create"
        class="px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors font-semibold flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle actualité
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
            placeholder="Rechercher une actualité..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
          />
        </div>

        <!-- Filtre statut -->
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="archived">Archivé</option>
        </select>

        <!-- Filtre catégorie -->
        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
        >
          <option value="">Toutes catégories</option>
          <option value="announcement">Annonce</option>
          <option value="project">Projet</option>
          <option value="event">Événement</option>
          <option value="innovation">Innovation</option>
          <option value="policy">Politique</option>
        </select>
      </div>
    </div>

    <!-- Tableau des actualités -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto"></div>
      </div>

      <!-- Liste -->
      <div v-else-if="newsList.length > 0">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actualité</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vues</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="news in newsList"
              :key="news._id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Actualité -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div v-if="news.coverImage" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="news.coverImage" :alt="news.title.fr" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ news.title.fr }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ news.excerpt?.fr || 'Pas d\'extrait' }}</p>
                  </div>
                </div>
              </td>

              <!-- Catégorie -->
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {{ getCategoryLabel(news.category) }}
                </span>
              </td>

              <!-- Statut -->
              <td class="px-6 py-4">
                <span :class="getStatusBadge(news.status)">
                  {{ getStatusLabel(news.status) }}
                </span>
              </td>

              <!-- Vues -->
              <td class="px-6 py-4 text-gray-600">
                {{ news.views || 0 }}
              </td>

              <!-- Date -->
              <td class="px-6 py-4 text-gray-600 text-sm">
                {{ formatDate(news.publishedAt || news.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="`/admin/news/edit/${news._id}`"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </router-link>

                  <button
                    @click="deleteNews(news._id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <router-link
                    :to="`/news/${news.slug}`"
                    target="_blank"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Voir"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-else class="p-12 text-center">
        <span class="text-6xl mb-4 block">📰</span>
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          Aucune actualité
        </h3>
        <p class="text-gray-600 mb-6">
          Commencez par créer votre première actualité
        </p>
        <router-link
          to="/admin/news/create"
          class="inline-block px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors font-semibold"
        >
          Créer une actualité
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNewsStore } from '../../../stores/news'

const newsStore = useNewsStore()

const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const loading = ref(false)

const newsList = computed(() => newsStore.news)

const getCategoryLabel = (category) => {
  const labels = {
    announcement: 'Annonce',
    project: 'Projet',
    event: 'Événement',
    innovation: 'Innovation',
    policy: 'Politique'
  }
  return labels[category] || category
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Brouillon',
    published: 'Publié',
    archived: 'Archivé'
  }
  return labels[status] || status
}

const getStatusBadge = (status) => {
  const classes = {
    draft: 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full',
    published: 'px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full',
    archived: 'px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'
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

const deleteNews = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return

  try {
    await newsStore.deleteNews(id)
    alert('Actualité supprimée avec succès')
  } catch (error) {
    alert('Erreur lors de la suppression')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await newsStore.fetchNews()
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
