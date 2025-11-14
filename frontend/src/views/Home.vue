<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-uemoa-500 to-primary-blue text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-heading font-bold mb-6">
            Répertoire des Acteurs des Énergies Renouvelables de l'UEMOA
          </h1>
          <p class="text-xl mb-8 opacity-90">
            Découvrez et connectez avec les acteurs du secteur des énergies renouvelables
            dans les 8 pays de l'UEMOA
          </p>

          <!-- Barre de recherche -->
          <div class="max-w-2xl mx-auto">
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Rechercher un acteur, un projet..."
                class="flex-1 px-6 py-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button class="btn-primary bg-white text-primary-green hover:bg-gray-100 px-8">
                🔍 Rechercher
              </button>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex gap-4 justify-center mt-8">
            <router-link to="/actors" class="btn-secondary">
              📋 Explorer les acteurs
            </router-link>
            <button class="btn-outline border-white text-white hover:bg-white hover:text-primary-green">
              🗺️ Voir la carte
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistiques -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-green mb-2">{{ stats.actors }}</div>
            <div class="text-gray-600">Acteurs</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-blue mb-2">{{ stats.countries }}</div>
            <div class="text-gray-600">Pays</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-primary-yellow mb-2">{{ stats.projects }}</div>
            <div class="text-gray-600">Projets</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-uemoa-600 mb-2">{{ stats.solar }}%</div>
            <div class="text-gray-600">Solaire</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pays de l'UEMOA -->
    <section class="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-heading font-bold mb-3">
            Les 8 Pays de l'UEMOA
          </h2>
          <p class="text-gray-600">
            Union Économique et Monétaire Ouest-Africaine
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div
            v-for="country in countries"
            :key="country.code"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center cursor-pointer hover:scale-105 transform"
          >
            <div class="text-7xl mb-3">{{ country.flag }}</div>
            <h3 class="font-semibold text-lg mb-1">{{ country.name }}</h3>
            <p class="text-sm text-gray-500 mb-2">{{ country.capital }}</p>
            <div class="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
              {{ country.actorsCount }} acteurs
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Types d'énergies -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-heading font-bold text-center mb-12">
          Types d'Énergies Renouvelables
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div v-for="energy in energyTypes" :key="energy.slug" class="card text-center cursor-pointer hover:scale-105 transition-transform">
            <div class="text-5xl mb-4">{{ energy.icon }}</div>
            <h3 class="font-semibold mb-2">{{ energy.name }}</h3>
            <p class="text-2xl font-bold text-primary-green">{{ energy.count }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Message de test de connexion API -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <div v-if="apiConnected" class="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg">
            <p class="font-semibold">✅ Connexion API réussie</p>
            <p class="text-sm">{{ apiMessage }}</p>
          </div>
          <div v-else-if="apiError" class="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg">
            <p class="font-semibold">❌ Erreur de connexion API</p>
            <p class="text-sm">{{ apiError }}</p>
          </div>
          <div v-else class="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg">
            <p>🔄 Connexion à l'API...</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReferenceStore } from '@/stores/reference'
import { useActorsStore } from '@/stores/actors'
import api from '../services/api'

const referenceStore = useReferenceStore()
const actorsStore = useActorsStore()

const stats = ref({
  actors: 0,
  countries: 8,
  projects: 0,
  solar: 0
})

const countries = ref([])
const energyTypes = ref([])

const apiConnected = ref(false)
const apiError = ref(null)
const apiMessage = ref('')
const loading = ref(true)

onMounted(async () => {
  loading.value = true

  // Tester la connexion à l'API
  try {
    const response = await api.get('/health')
    apiConnected.value = true
    apiMessage.value = response.data.message
    console.log('✅ API connectée:', response.data)
  } catch (error) {
    apiError.value = error.message
    console.error('❌ Erreur API:', error)
  }

  // Charger les données de référence
  await referenceStore.fetchAll()

  // Charger les acteurs pour obtenir les statistiques
  await actorsStore.fetchActors({ limit: 1 })

  // Mettre à jour les pays avec les vraies données
  countries.value = referenceStore.countries.map(country => ({
    code: country.code,
    name: country.name.fr,
    capital: country.capital,
    flag: country.flag,
    actorsCount: country.actorsCount || 0,
    _id: country._id
  }))

  // Mettre à jour les énergies avec les vraies données
  energyTypes.value = referenceStore.energies.map(energy => ({
    slug: energy.slug,
    name: energy.name.fr,
    icon: energy.icon,
    count: 0, // TODO: Calculer le nombre d'acteurs par énergie
    _id: energy._id
  }))

  // Mettre à jour les statistiques
  stats.value = {
    actors: actorsStore.pagination.total || 0,
    countries: countries.value.length,
    projects: 0, // TODO: Calculer depuis la base
    solar: 0 // TODO: Calculer le pourcentage
  }

  loading.value = false
})
</script>
