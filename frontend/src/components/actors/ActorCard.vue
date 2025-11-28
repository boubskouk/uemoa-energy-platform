<template>
  <router-link
    :to="`/actors/${actor._id}`"
    class="block bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-white/20 hover:border-primary-green/30 hover:scale-105"
  >
    <!-- Image/Logo with Gradient Overlay -->
    <div class="relative h-52 bg-gradient-to-br from-primary-green via-green-500 to-primary-blue overflow-hidden">
      <img
        v-if="actor.images?.coverImage"
        :src="actor.images.coverImage"
        :alt="actor.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <!-- Glassmorphism overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40"></div>

      <!-- Logo superposé avec glassmorphism -->
      <div class="absolute bottom-4 left-4 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-4 border-white/50 group-hover:scale-110 transition-transform duration-300">
        <img
          v-if="actor.images?.logo"
          :src="actor.images.logo"
          :alt="actor.name"
          class="w-full h-full object-contain p-2"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-green to-primary-blue text-white text-2xl font-bold">
          {{ actor.name.charAt(0) }}
        </div>
      </div>

      <!-- Badges with glassmorphism -->
      <div class="absolute top-4 right-4 flex gap-2">
        <span v-if="actor.verified" class="px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-xl shadow-lg border border-white/30">
          ✓ Vérifié
        </span>
        <span v-if="actor.featured" class="px-3 py-1.5 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-xl shadow-lg border border-white/30">
          ⭐ Vedette
        </span>
      </div>
    </div>

    <!-- Content with enhanced spacing -->
    <div class="p-5">
      <!-- Nom -->
      <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-green transition-colors duration-300">
        {{ actor.name }}
      </h3>

      <!-- Type with icon -->
      <div class="flex items-center gap-2 mb-3">
        <span class="px-3 py-1 bg-gradient-to-r from-primary-blue/10 to-blue-500/10 text-primary-blue text-xs font-bold rounded-lg">
          {{ getActorTypeIcon(actor.type) }} {{ getActorTypeLabel(actor.type) }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
        {{ actor.description?.fr || 'Aucune description disponible.' }}
      </p>

      <!-- Location with enhanced design -->
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50/50 rounded-lg px-3 py-2">
        <span class="text-xl">{{ actor.country?.flag }}</span>
        <span class="font-semibold">{{ actor.city || actor.location?.city || actor.country?.name?.fr }}</span>
      </div>

      <!-- Energies with larger icons -->
      <div v-if="actor.energyTypes && actor.energyTypes.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(energy, index) in actor.energyTypes.slice(0, 4)"
          :key="index"
          class="text-2xl hover:scale-125 transition-transform duration-300"
          :title="energy"
        >
          {{ getEnergyIcon(energy) }}
        </span>
        <span v-if="actor.energyTypes.length > 4" class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-semibold self-center">
          +{{ actor.energyTypes.length - 4 }}
        </span>
      </div>

      <!-- Stats with enhanced design -->
      <div class="flex items-center justify-between pt-4 border-t-2 border-gray-100">
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-1.5 hover:text-primary-green transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
            <span class="font-medium">{{ actor.stats?.views || 0 }}</span>
          </span>
        </div>
        <span class="text-primary-green text-sm font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
          Voir plus
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
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
    'institution_publique': 'Institution Publique',
    'entreprise': 'Entreprise',
    'ong': 'ONG',
    'association': 'Association',
    'universite': 'Université',
    'cooperative': 'Coopérative',
    'startup': 'Startup'
  }
  return labels[type] || type
}

const getActorTypeIcon = (type) => {
  const icons = {
    'institution_publique': '🏛️',
    'entreprise': '🏢',
    'ong': '🤝',
    'association': '👥',
    'universite': '🎓',
    'cooperative': '🌾',
    'startup': '🚀'
  }
  return icons[type] || '📋'
}

const getEnergyIcon = (energyName) => {
  const icons = {
    'Solaire': '☀️',
    'Solar': '☀️',
    'Éolienne': '💨',
    'Wind': '💨',
    'Hydraulique': '💧',
    'Hydro': '💧',
    'Biomasse': '🌿',
    'Biomass': '🌿',
    'Géothermie': '🌋',
    'Geothermal': '🌋',
    'Multi': '⚡'
  }
  return icons[energyName] || '⚡'
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
