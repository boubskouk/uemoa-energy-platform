<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-green to-primary-blue text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-heading font-bold mb-4">
          Statistiques & Analyses
        </h1>
        <p class="text-lg text-white/90 max-w-2xl">
          Visualisez les données des énergies renouvelables dans l'UEMOA
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p class="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>

      <div v-else>
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl">🏢</span>
              <span class="text-sm text-gray-500">Total</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalActors }}</p>
            <p class="text-sm text-gray-600">Acteurs</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl">🌍</span>
              <span class="text-sm text-gray-500">Pays</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-1">8</p>
            <p class="text-sm text-gray-600">Pays UEMOA</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl">⚡</span>
              <span class="text-sm text-gray-500">Énergies</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalEnergies }}</p>
            <p class="text-sm text-gray-600">Types d'énergie</p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-3xl">📊</span>
              <span class="text-sm text-gray-500">Activités</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.totalCategories }}</p>
            <p class="text-sm text-gray-600">Catégories</p>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Chart: Acteurs par Pays -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Acteurs par Pays</h2>
            <div class="h-80">
              <BarChart
                :labels="countryChartData.labels"
                :data="countryChartData.data"
                label="Nombre d'acteurs"
                background-color="#16a34a"
              />
            </div>
          </div>

          <!-- Chart: Répartition par Type d'Énergie -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Répartition par Type d'Énergie</h2>
            <div class="h-80">
              <DoughnutChart
                :labels="energyChartData.labels"
                :data="energyChartData.data"
              />
            </div>
          </div>

          <!-- Chart: Acteurs par Catégorie -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Acteurs par Catégorie d'Activité</h2>
            <div class="h-80">
              <BarChart
                :labels="categoryChartData.labels"
                :data="categoryChartData.data"
                label="Nombre d'acteurs"
                background-color="#3b82f6"
              />
            </div>
          </div>

          <!-- Chart: Répartition par Type d'Acteur -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Répartition par Type d'Acteur</h2>
            <div class="h-80">
              <DoughnutChart
                :labels="actorTypeChartData.labels"
                :data="actorTypeChartData.data"
                :colors="['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']"
              />
            </div>
          </div>
        </div>

        <!-- Evolution Chart -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Évolution des Inscriptions</h2>
            <select
              v-model="timelinePeriod"
              @change="loadTimeline"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-green"
            >
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="year">12 derniers mois</option>
            </select>
          </div>
          <div class="h-80">
            <LineChart
              v-if="timelineChartData.labels.length > 0"
              :labels="timelineChartData.labels"
              :datasets="timelineChartData.datasets"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
              Aucune donnée disponible pour cette période
            </div>
          </div>
        </div>

        <!-- Top Acteurs -->
        <div class="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Top 10 Acteurs les Plus Vus</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pays</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">Vues</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(actor, index) in topActors"
                  :key="actor._id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm text-gray-900 font-semibold">{{ index + 1 }}</td>
                  <td class="px-4 py-3">
                    <router-link
                      :to="`/actors/${actor._id}`"
                      class="text-sm text-primary-green hover:underline font-medium"
                    >
                      {{ actor.name }}
                    </router-link>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">
                    {{ actor.country?.flag }} {{ actor.country?.name?.fr }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ getActorTypeLabel(actor.type) }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    {{ actor.stats?.views || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import LineChart from '@/components/charts/LineChart.vue'

const loading = ref(true)
const timelinePeriod = ref('month')

const stats = ref({
  totalActors: 0,
  totalEnergies: 0,
  totalCategories: 0
})

const byCountry = ref([])
const byEnergy = ref([])
const byCategory = ref([])
const byActorType = ref([])
const timeline = ref([])
const topActors = ref([])

// Computed pour les données des graphiques
const countryChartData = computed(() => ({
  labels: byCountry.value.map(item => item.country?.name?.fr || 'Inconnu'),
  data: byCountry.value.map(item => item.count)
}))

const energyChartData = computed(() => ({
  labels: byEnergy.value.map(item => item.energy?.name?.fr || 'Inconnu'),
  data: byEnergy.value.map(item => item.count)
}))

const categoryChartData = computed(() => ({
  labels: byCategory.value.map(item => item.category?.name?.fr || 'Inconnu'),
  data: byCategory.value.map(item => item.count)
}))

const actorTypeChartData = computed(() => ({
  labels: byActorType.value.map(item => getActorTypeLabel(item._id)),
  data: byActorType.value.map(item => item.count)
}))

const timelineChartData = computed(() => {
  if (!timeline.value || timeline.value.length === 0) {
    return { labels: [], datasets: [] }
  }

  return {
    labels: timeline.value.map(item => item.date),
    datasets: [
      {
        label: 'Nouveaux acteurs',
        data: timeline.value.map(item => item.count),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)'
      }
    ]
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

const loadTimeline = async () => {
  try {
    const response = await api.get(`/stats/timeline?period=${timelinePeriod.value}`)
    timeline.value = response.data.timeline || []
  } catch (error) {
    console.error('Erreur chargement timeline:', error)
    timeline.value = []
  }
}

onMounted(async () => {
  loading.value = true

  try {
    // Charger toutes les stats en parallèle
    const [overviewRes, countryRes, energyRes, categoryRes, typeRes, timelineRes, topRes] = await Promise.all([
      api.get('/stats/overview'),
      api.get('/stats/by-country'),
      api.get('/stats/by-energy'),
      api.get('/stats/by-category'),
      api.get('/stats/by-actor-type'),
      api.get(`/stats/timeline?period=${timelinePeriod.value}`),
      api.get('/stats/top-actors?type=views&limit=10')
    ])

    // Mettre à jour les données
    stats.value = {
      totalActors: overviewRes.data.counts.actors || 0,
      totalEnergies: overviewRes.data.counts.energies || 0,
      totalCategories: overviewRes.data.counts.categories || 0
    }

    byCountry.value = countryRes.data.stats || []
    byEnergy.value = energyRes.data.stats || []
    byCategory.value = categoryRes.data.stats || []
    byActorType.value = typeRes.data.stats || []
    timeline.value = timelineRes.data.timeline || []
    topActors.value = topRes.data.actors || []

  } catch (error) {
    console.error('Erreur chargement stats:', error)
  } finally {
    loading.value = false
  }
})
</script>
