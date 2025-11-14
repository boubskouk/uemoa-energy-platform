<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
    <!-- Bouton Première page -->
    <button
      @click="goToPage(1)"
      :disabled="currentPage === 1"
      class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
      :class="currentPage === 1
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-100'"
    >
      ⏮️ Première
    </button>

    <!-- Bouton Précédent -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
      :class="currentPage === 1
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-100'"
    >
      ◀️ Précédent
    </button>

    <!-- Numéros de pages -->
    <div class="flex gap-1">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="page === currentPage
          ? 'bg-primary-green text-white'
          : 'text-gray-700 hover:bg-gray-100'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Bouton Suivant -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
      :class="currentPage === totalPages
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-100'"
    >
      Suivant ▶️
    </button>

    <!-- Bouton Dernière page -->
    <button
      @click="goToPage(totalPages)"
      :disabled="currentPage === totalPages"
      class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
      :class="currentPage === totalPages
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-100'"
    >
      Dernière ⏭️
    </button>
  </div>

  <!-- Info sur le total -->
  <div v-if="total > 0" class="text-center text-sm text-gray-600 mt-4">
    Affichage de {{ startItem }} à {{ endItem }} sur {{ total }} résultats
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  perPage: {
    type: Number,
    default: 20
  },
  maxVisible: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])

// Calculer les pages visibles
const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(props.maxVisible / 2)
  let start = Math.max(1, props.currentPage - half)
  let end = Math.min(props.totalPages, start + props.maxVisible - 1)

  // Ajuster le début si on est proche de la fin
  if (end - start + 1 < props.maxVisible) {
    start = Math.max(1, end - props.maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Calculer l'index du premier élément affiché
const startItem = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1
})

// Calculer l'index du dernier élément affiché
const endItem = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.total)
})

// Aller à une page spécifique
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
