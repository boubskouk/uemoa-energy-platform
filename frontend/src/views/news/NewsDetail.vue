<template>
  <div class="min-h-screen bg-gray-50">
    <!-- État de chargement -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <router-link
          to="/news"
          class="inline-block px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors"
        >
          Retour aux actualités
        </router-link>
      </div>
    </div>

    <!-- Contenu de l'actualité -->
    <article v-else-if="news" class="pb-12">
      <!-- Image de couverture -->
      <div class="relative h-96 bg-gradient-to-br from-primary-green to-primary-blue">
        <img
          v-if="news.coverImage"
          :src="news.coverImage"
          :alt="news.title.fr"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/30"></div>

        <!-- Titre sur l'image -->
        <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div class="container mx-auto">
            <div class="mb-4 flex flex-wrap gap-2 items-center">
              <span class="badge bg-white/90 text-gray-800">
                {{ getCategoryLabel(news.category) }}
              </span>
              <span v-if="news.featured" class="badge bg-yellow-400 text-gray-900">
                ⭐ À la une
              </span>
            </div>
            <h1 class="text-4xl md:text-5xl font-heading font-bold mb-4">
              {{ news.title.fr }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="container mx-auto px-4 -mt-8">
        <div class="max-w-4xl mx-auto">
          <!-- Carte de métadonnées -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex flex-wrap gap-6 text-sm text-gray-600">
              <!-- Date de publication -->
              <div class="flex items-center gap-2">
                <span class="text-xl">📅</span>
                <span>{{ formatDate(news.publishedAt) }}</span>
              </div>

              <!-- Auteur -->
              <div v-if="news.author?.name" class="flex items-center gap-2">
                <span class="text-xl">✍️</span>
                <span>{{ news.author.name }}</span>
              </div>

              <!-- Vues -->
              <div class="flex items-center gap-2">
                <span class="text-xl">👁️</span>
                <span>{{ news.views || 0 }} vues</span>
              </div>

              <!-- Pays liés -->
              <div v-if="news.relatedCountries && news.relatedCountries.length > 0" class="flex items-center gap-2">
                <span class="text-xl">🌍</span>
                <span>{{ news.relatedCountries.map(c => c.name.fr).join(', ') }}</span>
              </div>
            </div>
          </div>

          <!-- Extrait -->
          <div v-if="news.excerpt?.fr" class="bg-primary-green/10 border-l-4 border-primary-green p-6 rounded-r-lg mb-8">
            <p class="text-lg text-gray-700 italic">
              {{ news.excerpt.fr }}
            </p>
          </div>

          <!-- Contenu -->
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <div
              v-if="news.content?.fr"
              class="prose prose-lg max-w-none"
              v-html="formatContent(news.content.fr)"
            ></div>
            <p v-else class="text-gray-500 italic">
              Aucun contenu disponible
            </p>
          </div>

          <!-- Tags -->
          <div v-if="news.tags && news.tags.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in news.tags"
                :key="tag"
                class="px-3 py-1 bg-primary-green/10 text-primary-green rounded-full text-sm"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Actualités associées -->
          <div v-if="news.relatedActors && news.relatedActors.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Acteurs associés</h3>
            <div class="space-y-3">
              <router-link
                v-for="actor in news.relatedActors"
                :key="actor._id"
                :to="`/actors/${actor.slug}`"
                class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p class="font-medium text-gray-800">{{ actor.name }}</p>
                <p v-if="actor.type" class="text-sm text-gray-600">{{ actor.type }}</p>
              </router-link>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex gap-4">
            <router-link
              to="/news"
              class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ← Retour aux actualités
            </router-link>
            <button
              @click="shareNews"
              class="px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors font-medium"
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
import { useNewsStore } from '../../stores/news'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const news = computed(() => newsStore.currentNews)
const loading = computed(() => newsStore.loading)
const error = computed(() => newsStore.error)

// Charger l'actualité
const loadNews = async () => {
  try {
    const identifier = route.params.slug || route.params.id

    // Vérifier que l'identifiant est valide
    if (!identifier || identifier === 'undefined' || identifier === 'null') {
      console.error('Identifiant invalide:', identifier)
      router.push('/news')
      return
    }

    await newsStore.fetchNewsById(identifier)
  } catch (err) {
    console.error('Erreur lors du chargement de l\'actualité:', err)
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

// Formater le contenu (convertir les retours à la ligne en paragraphes)
const formatContent = (content) => {
  if (!content) return ''
  // Convertir les retours à la ligne en paragraphes
  return content
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

// Obtenir le label de catégorie
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

// Partager l'actualité
const shareNews = () => {
  if (navigator.share) {
    navigator.share({
      title: news.value.title.fr,
      text: news.value.excerpt?.fr || '',
      url: window.location.href
    }).catch(err => console.error('Erreur de partage:', err))
  } else {
    // Fallback: copier le lien
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié dans le presse-papier!')
  }
}

// Chargement initial
onMounted(() => {
  loadNews()
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
  @apply text-primary-green hover:underline;
}
</style>
