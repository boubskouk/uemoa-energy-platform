<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        {{ isEditing ? 'Modifier l\'actualité' : 'Créer une actualité' }}
      </h1>
      <p class="text-gray-600">{{ isEditing ? 'Modifiez' : 'Ajoutez' }} les informations de votre actualité</p>
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
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="Titre en français"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre (English)</label>
            <input
              v-model="form.title.en"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="Title in English"
            />
          </div>
        </div>
      </div>

      <!-- Catégorie et Statut -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Catégorie et Statut</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="announcement">Annonce</option>
              <option value="project">Projet</option>
              <option value="event">Événement</option>
              <option value="innovation">Innovation</option>
              <option value="policy">Politique</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contenu -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Contenu</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Extrait (Français)</label>
            <textarea
              v-model="form.excerpt.fr"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="Résumé court de l'actualité"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contenu (Français) *</label>
            <textarea
              v-model="form.content.fr"
              rows="10"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="Contenu complet de l'actualité"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors font-semibold disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>

        <router-link
          to="/admin/news"
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
import { useNewsStore } from '../../../stores/news'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)

const form = ref({
  title: { fr: '', en: '' },
  excerpt: { fr: '', en: '' },
  content: { fr: '', en: '' },
  category: '',
  status: 'draft'
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await newsStore.updateNews(route.params.id, form.value)
      alert('Actualité mise à jour avec succès')
    } else {
      await newsStore.createNews(form.value)
      alert('Actualité créée avec succès')
    }
    router.push('/admin/news')
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
      const news = await newsStore.fetchNewsById(route.params.id)
      if (news) {
        form.value = {
          title: news.title || { fr: '', en: '' },
          excerpt: news.excerpt || { fr: '', en: '' },
          content: news.content || { fr: '', en: '' },
          category: news.category || '',
          status: news.status || 'draft'
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
