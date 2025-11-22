<template>
  <router-link
    :to="`/actors/${actor._id}`"
    class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
  >
    <!-- Image/Logo -->
    <div class="relative h-48 bg-gradient-to-br from-primary-green to-primary-blue overflow-hidden">
      <img
        v-if="actor.images?.coverImage"
        :src="actor.images.coverImage"
        :alt="actor.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute inset-0 bg-black/20"></div>

      <!-- Logo superposé -->
      <div class="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-white">
        <img
          v-if="actor.images?.logo"
          :src="actor.images.logo"
          :alt="actor.name"
          class="w-full h-full object-contain p-1"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-green to-primary-blue text-white text-xl font-bold">
          {{ actor.name.charAt(0) }}
        </div>
      </div>

      <!-- Badges -->
      <div class="absolute top-4 right-4 flex gap-2">
        <span v-if="actor.verified" class="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
          ✓ Vérifié
        </span>
        <span v-if="actor.featured" class="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
          ⭐
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Nom -->
      <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-green transition-colors">
        {{ actor.name }}
      </h3>

      <!-- Type -->
      <p class="text-sm text-gray-600 mb-3">
        {{ getActorTypeLabel(actor.type) }}
      </p>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ actor.description?.fr || 'Aucune description disponible.' }}
      </p>

      <!-- Location -->
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span>{{ actor.country?.flag }}</span>
        <span class="font-medium">{{ actor.location?.city || actor.country?.name?.fr }}</span>
      </div>

      <!-- Energies -->
      <div v-if="actor.energies && actor.energies.length > 0" class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="energy in actor.energies.slice(0, 3)"
          :key="energy._id"
          class="text-xl"
          :title="energy.name?.fr"
        >
          {{ energy.icon }}
        </span>
        <span v-if="actor.energies.length > 3" class="text-sm text-gray-500">
          +{{ actor.energies.length - 3 }}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-200">
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            👁️ {{ actor.stats?.views || 0 }}
          </span>
          <span class="flex items-center gap-1">
            📧 {{ actor.stats?.contacts || 0 }}
          </span>
        </div>
        <span class="text-primary-green text-sm font-semibold group-hover:underline">
          Voir plus →
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  actor: {
    type: Object,
    required: true
  }
})

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
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
