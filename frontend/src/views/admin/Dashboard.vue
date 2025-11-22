<template>
  <div class="space-y-6">
    <!-- Titre -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
      <p class="text-gray-600">Bienvenue sur votre espace d'administration</p>
    </div>

    <!-- KPIs Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Acteurs -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-100 rounded-lg">
            <span class="text-3xl">🏢</span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Total Acteurs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.actors }}</p>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span class="text-green-600 font-semibold">↗️ +12%</span>
          <span class="text-gray-500 ml-2">ce mois</span>
        </div>
      </div>

      <!-- Actualités -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-100 rounded-lg">
            <span class="text-3xl">📰</span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Actualités</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.news }}</p>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span class="text-green-600 font-semibold">↗️ +5%</span>
          <span class="text-gray-500 ml-2">ce mois</span>
        </div>
      </div>

      <!-- Événements -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-purple-100 rounded-lg">
            <span class="text-3xl">📅</span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Événements à venir</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.upcomingEvents }}</p>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span class="text-blue-600 font-semibold">{{ stats.ongoingEvents }} en cours</span>
        </div>
      </div>

      <!-- Utilisateurs -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-yellow-100 rounded-lg">
            <span class="text-3xl">👥</span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Utilisateurs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.users }}</p>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span class="text-orange-600 font-semibold">{{ stats.pendingUsers }} en attente</span>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Graphique: Acteurs par pays -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Acteurs par Pays</h2>
        <div class="h-64">
          <BarChart
            v-if="chartDataByCountry.labels.length > 0"
            :labels="chartDataByCountry.labels"
            :data="chartDataByCountry.data"
            label="Acteurs"
            background-color="#16a34a"
          />
        </div>
      </div>

      <!-- Graphique: Répartition par type -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Types d'Acteurs</h2>
        <div class="h-64">
          <DoughnutChart
            v-if="chartDataByType.labels.length > 0"
            :labels="chartDataByType.labels"
            :data="chartDataByType.data"
          />
        </div>
      </div>
    </div>

    <!-- Graphiques et activités récentes -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activité récente -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
          >
            <div class="p-2 bg-gray-100 rounded-lg">
              <span class="text-xl">{{ activity.icon }}</span>
            </div>
            <div class="flex-1">
              <p class="text-gray-900 font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
            </div>
            <button class="text-gray-400 hover:text-primary-green">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div class="space-y-3">
          <router-link
            to="/admin/news/create"
            class="block p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-center font-semibold"
          >
            📰 Créer une actualité
          </router-link>

          <router-link
            to="/admin/events/create"
            class="block p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-center font-semibold"
          >
            📅 Créer un événement
          </router-link>

          <router-link
            to="/admin/actors"
            class="block p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-center font-semibold"
          >
            🏢 Gérer les acteurs
          </router-link>

          <router-link
            to="/admin/users"
            class="block p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-center font-semibold"
          >
            👥 Approuver utilisateurs
          </router-link>
        </div>
      </div>
    </div>

    <!-- Contenu par pays -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Répartition par pays</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="country in countryStats"
          :key="country.code"
          class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="text-center">
            <span class="text-4xl mb-2 block">{{ country.flag }}</span>
            <p class="font-semibold text-gray-900">{{ country.name }}</p>
            <p class="text-2xl font-bold text-primary-green mt-2">{{ country.count }}</p>
            <p class="text-xs text-gray-500">acteurs</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dernières actualités et événements -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Dernières actualités -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Dernières actualités</h2>
          <router-link to="/admin/news" class="text-primary-green hover:underline text-sm font-semibold">
            Voir tout →
          </router-link>
        </div>
        <div class="space-y-3">
          <div
            v-for="news in latestNews"
            :key="news.id"
            class="p-3 border border-gray-200 rounded-lg hover:border-primary-green transition-colors cursor-pointer"
          >
            <div class="flex items-start gap-3">
              <div v-if="news.coverImage" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img :src="news.coverImage" :alt="news.title" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ news.title }}</p>
                <p class="text-xs text-gray-500">{{ news.date }}</p>
              </div>
              <span :class="getStatusBadge(news.status)">
                {{ news.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Prochains événements -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Prochains événements</h2>
          <router-link to="/admin/events" class="text-primary-green hover:underline text-sm font-semibold">
            Voir tout →
          </router-link>
        </div>
        <div class="space-y-3">
          <div
            v-for="event in upcomingEventsList"
            :key="event.id"
            class="p-3 border border-gray-200 rounded-lg hover:border-primary-blue transition-colors cursor-pointer"
          >
            <div class="flex items-start gap-3">
              <div class="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <span class="text-xl">📅</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ event.title }}</p>
                <p class="text-xs text-gray-500">{{ event.date }} • {{ event.location }}</p>
              </div>
            </div>
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

// Statistiques
const stats = ref({
  actors: 0,
  news: 0,
  upcomingEvents: 0,
  ongoingEvents: 0,
  users: 0,
  pendingUsers: 0
})

// Activités récentes
const recentActivities = ref([
  {
    id: 1,
    icon: '📰',
    title: 'Nouvelle actualité publiée',
    description: 'Lancement du projet solaire au Sénégal',
    time: 'Il y a 5 minutes'
  },
  {
    id: 2,
    icon: '👥',
    title: 'Nouvel utilisateur inscrit',
    description: 'Jean Kouassi - En attente d\'approbation',
    time: 'Il y a 1 heure'
  },
  {
    id: 3,
    icon: '🏢',
    title: 'Acteur approuvé',
    description: 'Énergie Verte Bénin validé',
    time: 'Il y a 2 heures'
  },
  {
    id: 4,
    icon: '📅',
    title: 'Événement créé',
    description: 'Forum Énergie UEMOA 2025',
    time: 'Il y a 3 heures'
  }
])

// Répartition par pays
const countryStats = ref([
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', count: 0 },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', count: 0 },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', count: 0 },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', count: 0 },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', count: 0 },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', count: 0 },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', count: 0 },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', count: 0 }
])

// Répartition par type d'acteur
const actorTypeStats = ref([])

// Computed pour les données des graphiques
const chartDataByCountry = computed(() => ({
  labels: countryStats.value.map(item => item.country || item.name),
  data: countryStats.value.map(item => item.count)
}))

const chartDataByType = computed(() => {
  const typeLabels = {
    'company': 'Entreprise',
    'ngo': 'ONG',
    'association': 'Association',
    'institution': 'Institution',
    'startup': 'Startup',
    'cooperative': 'Coopérative'
  }

  return {
    labels: actorTypeStats.value.map(item => typeLabels[item._id] || item._id),
    data: actorTypeStats.value.map(item => item.count)
  }
})

// Dernières actualités
const latestNews = ref([
  { id: 1, title: 'Nouveau projet solaire au Sénégal', date: '14 Nov 2025', status: 'Publié', coverImage: null },
  { id: 2, title: 'Formation en énergie éolienne', date: '13 Nov 2025', status: 'Brouillon', coverImage: null },
  { id: 3, title: 'Partenariat international signé', date: '12 Nov 2025', status: 'Publié', coverImage: null }
])

// Prochains événements
const upcomingEventsList = ref([
  { id: 1, title: 'Forum Énergie UEMOA 2025', date: '15 Déc 2025', location: 'Dakar' },
  { id: 2, title: 'Atelier Biomasse', date: '20 Déc 2025', location: 'Abidjan' },
  { id: 3, title: 'Conférence Solaire', date: '5 Jan 2026', location: 'Lomé' }
])

// Obtenir le badge de statut
const getStatusBadge = (status) => {
  const classes = {
    'Publié': 'px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full',
    'Brouillon': 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full',
    'Archivé': 'px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full'
  }
  return classes[status] || 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full'
}

// Charger les statistiques
const loadStats = async () => {
  try {
    // Charger les stats depuis l'API
    const [dashboardRes, typeRes] = await Promise.all([
      api.get('/stats/admin-dashboard'),
      api.get('/stats/by-actor-type')
    ])

    console.log('📊 Admin Dashboard Stats:', dashboardRes.data)
    console.log('📊 Actor Type Stats:', typeRes.data)

    // Vérifier si les données existent
    if (!dashboardRes.data || !dashboardRes.data.stats) {
      console.warn('⚠️ Pas de données stats dans la réponse admin-dashboard')
      return
    }

    const data = dashboardRes.data.stats

    stats.value = {
      actors: data.totalActors || 0,
      news: data.totalNews || 0,
      upcomingEvents: data.upcomingEvents || 0,
      ongoingEvents: data.ongoingEvents || 0,
      users: data.totalUsers || 0,
      pendingUsers: data.pendingActors || 0
    }

    // Mettre à jour les stats par pays
    if (data.byCountry && data.byCountry.length > 0) {
      countryStats.value = data.byCountry.map(item => ({
        country: item.country.name.fr,
        flag: item.country.flag,
        count: item.count
      }))
    }

    // Mettre à jour les stats par type d'acteur
    if (typeRes.data && typeRes.data.stats && typeRes.data.stats.length > 0) {
      actorTypeStats.value = typeRes.data.stats
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des stats admin:', error)
    console.error('Détails:', error.response?.data || error.message)
    // Garder les valeurs par défaut en cas d'erreur
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
