<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-heading font-bold text-gray-800 mb-4">Filtrer les actualités</h3>

    <div class="space-y-4">
      <!-- Recherche par texte -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Rechercher
        </label>
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Titre, contenu..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
          @input="debounceSearch"
        />
      </div>

      <!-- Filtre par catégorie -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Catégorie
        </label>
        <select
          v-model="localFilters.category"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
          @change="emitFilters"
        >
          <option :value="null">Toutes les catégories</option>
          <option value="announcement">Annonce</option>
          <option value="project">Projet</option>
          <option value="event">Événement</option>
          <option value="innovation">Innovation</option>
          <option value="policy">Politique</option>
        </select>
      </div>

      <!-- Filtre par pays -->
      <div v-if="countries && countries.length > 0">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Pays
        </label>
        <select
          v-model="localFilters.country"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
          @change="emitFilters"
        >
          <option :value="null">Tous les pays</option>
          <option
            v-for="country in countries"
            :key="country._id"
            :value="country._id"
          >
            {{ country.name.fr }}
          </option>
        </select>
      </div>

      <!-- Filtre featured -->
      <div>
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            v-model="localFilters.featured"
            type="checkbox"
            class="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
            @change="emitFilters"
          />
          <span class="text-sm text-gray-700">⭐ À la une uniquement</span>
        </label>
      </div>

      <!-- Bouton réinitialiser -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useReferenceStore } from '../../stores/reference'

const emit = defineEmits(['update:filters'])

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      search: '',
      category: null,
      country: null,
      featured: null
    })
  }
})

// Store pour récupérer les pays
const referenceStore = useReferenceStore()
const countries = computed(() => referenceStore.countries)

// Charger les pays au montage
if (countries.value.length === 0) {
  referenceStore.fetchAll()
}

// Filtres locaux
const localFilters = ref({
  search: props.initialFilters.search || '',
  category: props.initialFilters.category || null,
  country: props.initialFilters.country || null,
  featured: props.initialFilters.featured || null
})

// Vérifier s'il y a des filtres actifs
const hasActiveFilters = computed(() => {
  return localFilters.value.search !== '' ||
         localFilters.value.category !== null ||
         localFilters.value.country !== null ||
         localFilters.value.featured !== null
})

// Debounce pour la recherche
let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emitFilters()
  }, 500)
}

// Émettre les filtres au parent
const emitFilters = () => {
  emit('update:filters', {
    search: localFilters.value.search,
    category: localFilters.value.category,
    country: localFilters.value.country,
    featured: localFilters.value.featured
  })
}

// Réinitialiser les filtres
const resetFilters = () => {
  localFilters.value = {
    search: '',
    category: null,
    country: null,
    featured: null
  }
  emitFilters()
}

// Watch pour synchroniser avec les props
watch(() => props.initialFilters, (newFilters) => {
  localFilters.value = {
    search: newFilters.search || '',
    category: newFilters.category || null,
    country: newFilters.country || null,
    featured: newFilters.featured || null
  }
}, { deep: true })
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
