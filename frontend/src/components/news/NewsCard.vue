<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <!-- Image de couverture -->
    <router-link :to="newsLink" class="block relative overflow-hidden h-48">
      <img
        v-if="news.coverImage"
        :src="news.coverImage"
        :alt="languageStore.getText(news.title)"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-primary-green to-primary-blue flex items-center justify-center">
        <span class="text-white text-6xl">📰</span>
      </div>

      <!-- Badge catégorie -->
      <div class="absolute top-3 left-3">
        <span class="badge badge-category">
          {{ getCategoryLabel(news.category) }}
        </span>
      </div>

      <!-- Badge featured -->
      <div v-if="news.featured" class="absolute top-3 right-3">
        <span class="badge badge-featured">{{ featuredText }}</span>
      </div>
    </router-link>

    <!-- Contenu -->
    <div class="p-5">
      <!-- Titre -->
      <router-link :to="newsLink">
        <h3 class="text-xl font-heading font-bold text-gray-800 mb-3 hover:text-primary-green transition-colors line-clamp-2">
          {{ languageStore.getText(news.title) }}
        </h3>
      </router-link>

      <!-- Extrait -->
      <p v-if="news.excerpt" class="text-gray-600 mb-4 line-clamp-3">
        {{ languageStore.getText(news.excerpt) }}
      </p>

      <!-- Tags -->
      <div v-if="news.tags && news.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in news.tags.slice(0, 3)"
          :key="tag"
          class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center gap-4">
          <!-- Date -->
          <span class="flex items-center gap-1">
            📅 {{ formatDate(news.publishedAt) }}
          </span>

          <!-- Vues -->
          <span class="flex items-center gap-1">
            👁️ {{ news.views || 0 }}
          </span>
        </div>

        <!-- Bouton lire plus -->
        <router-link
          :to="newsLink"
          class="text-primary-green hover:text-primary-blue font-semibold"
        >
          {{ readMoreText }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'

const props = defineProps({
  news: {
    type: Object,
    required: true
  }
})

const languageStore = useLanguageStore()

// Computed property pour générer le lien sécurisé
const newsLink = computed(() => {
  // Utiliser le slug en priorité, sinon l'_id
  const identifier = props.news.slug || props.news._id
  return identifier ? `/news/${identifier}` : '/news'
})

const getCategoryLabel = (category) => {
  const labels = {
    announcement: { fr: 'Annonce', en: 'Announcement' },
    project: { fr: 'Projet', en: 'Project' },
    event: { fr: 'Événement', en: 'Event' },
    innovation: { fr: 'Innovation', en: 'Innovation' },
    policy: { fr: 'Politique', en: 'Policy' },
    financing: { fr: 'Financement', en: 'Financing' },
    infrastructure: { fr: 'Infrastructure', en: 'Infrastructure' },
    access: { fr: 'Accès à l\'énergie', en: 'Energy Access' }
  }
  return languageStore.getText(labels[category]) || category
}

const formatDate = (date) => {
  if (!date) return ''
  const locale = languageStore.currentLanguage === 'fr' ? 'fr-FR' : 'en-US'
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const featuredText = computed(() => {
  return languageStore.currentLanguage === 'fr' ? '⭐ À la une' : '⭐ Featured'
})

const readMoreText = computed(() => {
  return languageStore.currentLanguage === 'fr' ? 'Lire la suite →' : 'Read more →'
})
</script>

<style scoped>
.badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
}

.badge-category {
  @apply bg-white/90 backdrop-blur-sm text-gray-800;
}

.badge-featured {
  @apply bg-yellow-400 text-gray-900;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
