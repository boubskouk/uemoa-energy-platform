<template>
  <div class="min-h-screen">
    <!-- Slider Hero Section -->
    <Slider :slides="heroSlides" :autoplay-delay="7000" />

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
import Slider from '@/components/common/Slider.vue'
import api from '../services/api'

const referenceStore = useReferenceStore()
const actorsStore = useActorsStore()

// Données du slider hero
const heroSlides = ref([
  {
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80',
    badge: '🌍 UEMOA',
    title: {
      fr: 'Répertoire des Acteurs des Énergies Renouvelables',
      en: 'Directory of Renewable Energy Actors'
    },
    description: {
      fr: 'Découvrez et connectez avec les acteurs du secteur des énergies renouvelables dans les 8 pays de l\'UEMOA',
      en: 'Discover and connect with renewable energy sector actors in the 8 WAEMU countries'
    },
    primaryButton: {
      text: { fr: 'Explorer les acteurs', en: 'Explore actors' },
      link: '/actors'
    },
    secondaryButton: {
      text: { fr: 'En savoir plus', en: 'Learn more' },
      link: '/about'
    }
  },
  {
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80',
    badge: '☀️ Solaire',
    title: {
      fr: 'L\'Énergie Solaire en Afrique de l\'Ouest',
      en: 'Solar Energy in West Africa'
    },
    description: {
      fr: 'Plus de 300 jours d\'ensoleillement par an. Le solaire photovoltaïque, une solution d\'avenir pour l\'électrification rurale',
      en: 'Over 300 days of sunshine per year. Photovoltaic solar, a future solution for rural electrification'
    },
    primaryButton: {
      text: { fr: 'Voir les projets solaires', en: 'View solar projects' },
      link: '/actors?energy=solaire-photovoltaique'
    }
  },
  {
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1920&q=80',
    badge: '💨 Éolien',
    title: {
      fr: 'Le Potentiel Éolien du Sahel',
      en: 'The Wind Potential of the Sahel'
    },
    description: {
      fr: 'Des vents constants et puissants. Le Sahel dispose d\'un potentiel éolien considérable pour produire une énergie propre',
      en: 'Constant and powerful winds. The Sahel has considerable wind potential for clean energy production'
    },
    primaryButton: {
      text: { fr: 'Découvrir les parcs éoliens', en: 'Discover wind farms' },
      link: '/actors?energy=eolien'
    }
  },
  {
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80',
    badge: '💧 Hydraulique',
    title: {
      fr: 'Hydro-électricité : Exploiter la Force de l\'Eau',
      en: 'Hydroelectricity: Harnessing Water Power'
    },
    description: {
      fr: 'Des rivières au potentiel inexploité. Les micro-centrales hydrauliques pour l\'électrification des zones rurales',
      en: 'Rivers with untapped potential. Micro hydro power plants for rural electrification'
    },
    primaryButton: {
      text: { fr: 'Voir les projets hydrauliques', en: 'View hydro projects' },
      link: '/actors?energy=hydraulique'
    }
  },
  {
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1920&q=80',
    badge: '🌾 Biomasse',
    title: {
      fr: 'Biomasse et Biogaz : Valoriser les Déchets',
      en: 'Biomass and Biogas: Valorizing Waste'
    },
    description: {
      fr: 'Transformer les résidus agricoles en énergie. Solutions innovantes de biogaz et biocarburants pour un développement durable',
      en: 'Transform agricultural waste into energy. Innovative biogas and biofuel solutions for sustainable development'
    },
    primaryButton: {
      text: { fr: 'Explorer les solutions biomasse', en: 'Explore biomass solutions' },
      link: '/actors?energy=biomasse'
    }
  }
])

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

  // Récupérer les statistiques depuis l'API
  try {
    const statsResponse = await api.get('/stats/overview')
    const byEnergyResponse = await api.get('/stats/by-energy')

    console.log('📊 Stats overview:', statsResponse.data)
    console.log('⚡ Stats by energy:', byEnergyResponse.data)

    // Mettre à jour les pays avec les vraies données
    countries.value = referenceStore.countries.map(country => ({
      code: country.code,
      name: country.name.fr,
      capital: country.capital,
      flag: country.flag,
      actorsCount: country.actorsCount || 0,
      _id: country._id
    }))

    // Créer un map des énergies avec leur nombre d'acteurs
    const energyCountMap = {}
    if (byEnergyResponse.data && byEnergyResponse.data.stats && Array.isArray(byEnergyResponse.data.stats)) {
      byEnergyResponse.data.stats.forEach(item => {
        energyCountMap[item._id] = item.count
      })
    }

    // Mettre à jour les énergies avec les vraies données
    energyTypes.value = referenceStore.energies.map(energy => ({
      slug: energy.slug,
      name: energy.name.fr,
      icon: energy.icon,
      count: energyCountMap[energy._id] || 0,
      _id: energy._id
    }))

    // Calculer le pourcentage d'énergie solaire
    const totalActors = statsResponse.data?.counts?.actors || 0
    let solarActorsCount = 0

    if (byEnergyResponse.data && byEnergyResponse.data.stats && Array.isArray(byEnergyResponse.data.stats)) {
      const solarEnergies = byEnergyResponse.data.stats.filter(item => {
        const energyName = referenceStore.energies.find(e => e._id === item._id)?.name.fr || ''
        return energyName.toLowerCase().includes('solaire')
      })
      solarActorsCount = solarEnergies.reduce((sum, item) => sum + item.count, 0)
    }

    const solarPercentage = totalActors > 0 ? Math.round((solarActorsCount / totalActors) * 100) : 0

    // Mettre à jour les statistiques
    stats.value = {
      actors: statsResponse.data?.counts?.actors || 0,
      countries: countries.value.length,
      projects: statsResponse.data?.counts?.actors || 0, // Utiliser le nombre d'acteurs comme approximation des projets
      solar: solarPercentage
    }

  } catch (error) {
    console.error('❌ Erreur lors du chargement des stats:', error)
    console.error('Détails:', error.response?.data || error.message)
    // Fallback sur les données de base
    stats.value = {
      actors: actorsStore.pagination.total || 0,
      countries: countries.value.length,
      projects: 0,
      solar: 0
    }

    energyTypes.value = referenceStore.energies.map(energy => ({
      slug: energy.slug,
      name: energy.name.fr,
      icon: energy.icon,
      count: 0,
      _id: energy._id
    }))
  }

  loading.value = false
})
</script>
