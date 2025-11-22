<template>
  <div :id="mapId" class="w-full h-full rounded-lg overflow-hidden shadow-md"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  actors: {
    type: Array,
    default: () => []
  },
  center: {
    type: Array,
    default: () => [12.6392, -8.0029] // Centre approximatif de l'UEMOA
  },
  zoom: {
    type: Number,
    default: 5
  },
  height: {
    type: String,
    default: '400px'
  },
  showControls: {
    type: Boolean,
    default: true
  },
  singleMarker: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['marker-click'])

const mapId = ref(`map-${Math.random().toString(36).substr(2, 9)}`)
let map = null
let markers = []

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const initMap = () => {
  // Créer la carte
  map = L.map(mapId.value, {
    zoomControl: props.showControls
  }).setView(props.center, props.zoom)

  // Ajouter les tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map)

  // Ajouter les marqueurs
  addMarkers()
}

const addMarkers = () => {
  // Supprimer les anciens marqueurs
  markers.forEach(marker => marker.remove())
  markers = []

  if (!props.actors || props.actors.length === 0) return

  // Créer une icône personnalisée
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 bg-primary-green rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  const bounds = []

  props.actors.forEach(actor => {
    if (!actor.location?.coordinates?.length) return

    const [lng, lat] = actor.location.coordinates

    // Créer le marqueur
    const marker = L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-gray-900 mb-2">${actor.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${actor.type || 'Acteur'}</p>
          ${actor.location?.city ? `<p class="text-sm text-gray-500 mb-2">📍 ${actor.location.city}</p>` : ''}
          <a href="/actors/${actor._id}" class="text-primary-green text-sm font-semibold hover:underline">
            Voir le profil →
          </a>
        </div>
      `)
      .on('click', () => {
        emit('marker-click', actor)
      })

    markers.push(marker)
    bounds.push([lat, lng])
  })

  // Ajuster la vue pour montrer tous les marqueurs
  if (bounds.length > 0 && !props.singleMarker) {
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

// Watch pour mettre à jour les marqueurs quand les acteurs changent
watch(() => props.actors, () => {
  if (map) {
    addMarkers()
  }
}, { deep: true })

onMounted(() => {
  // Petit délai pour s'assurer que le DOM est prêt
  setTimeout(() => {
    initMap()
  }, 100)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
/* Styles pour le marqueur personnalisé */
.custom-marker {
  background: transparent;
  border: none;
}

/* Override des styles Leaflet pour les popups */
.leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.leaflet-popup-content {
  margin: 0;
  font-family: inherit;
}

.leaflet-popup-tip {
  background: white;
}

/* Animation du marqueur */
.custom-marker:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
