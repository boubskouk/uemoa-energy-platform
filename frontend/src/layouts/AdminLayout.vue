<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-50',
        sidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Logo et titre -->
      <div class="p-4 border-b border-gray-800">
        <router-link to="/admin" class="flex items-center gap-3">
          <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-yellow-500 rounded-lg shadow-md flex-shrink-0">
            <svg viewBox="0 0 100 100" class="w-8 h-8">
              <g fill="white">
                <circle cx="50" cy="20" r="3"/>
                <circle cx="70" cy="30" r="3"/>
                <circle cx="80" cy="50" r="3"/>
                <circle cx="70" cy="70" r="3"/>
                <circle cx="50" cy="80" r="3"/>
                <circle cx="30" cy="70" r="3"/>
                <circle cx="20" cy="50" r="3"/>
                <circle cx="30" cy="30" r="3"/>
              </g>
              <circle cx="50" cy="50" r="15" fill="none" stroke="white" stroke-width="2"/>
              <path d="M50 45 Q 55 35 50 30 Q 45 35 50 45" fill="white"/>
            </svg>
          </div>
          <div v-if="sidebarOpen" class="flex-1">
            <h2 class="text-lg font-bold">UEMOA Admin</h2>
            <p class="text-xs text-gray-400">Tableau de bord</p>
          </div>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActiveRoute(item) ? 'bg-green-600 text-white' : 'hover:bg-gray-800'
          ]"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="flex-1">{{ item.label }}</span>
          <span
            v-if="sidebarOpen && item.badge"
            class="px-2 py-1 text-xs bg-red-500 rounded-full"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- Toggle sidebar (bottom) -->
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <svg
          class="w-5 h-5 transition-transform"
          :class="{ 'rotate-180': !sidebarOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </aside>

    <!-- Main Content -->
    <div
      :class="[
        'transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20'
      ]"
    >
      <!-- Top Bar -->
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="flex items-center justify-between px-6 py-4">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <router-link to="/admin" class="hover:text-primary-green">Admin</router-link>
            <span v-if="currentPageTitle">›</span>
            <span v-if="currentPageTitle" class="font-semibold text-gray-900">{{ currentPageTitle }}</span>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User Profile -->
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">Admin User</p>
                <p class="text-xs text-gray-500">Administrateur</p>
              </div>
              <div class="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-blue rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Se déconnecter"
            >
              <svg class="w-6 h-6 text-gray-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(true)

const menuItems = ref([
  { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { path: '/admin/news', icon: '📰', label: 'Actualités' },
  { path: '/admin/events', icon: '📅', label: 'Événements' },
  { path: '/admin/actors', icon: '🏢', label: 'Acteurs', badge: 3 },
  { path: '/admin/users', icon: '👥', label: 'Utilisateurs', badge: 5 },
  { path: '/admin/settings', icon: '⚙️', label: 'Paramètres' },
])

const currentPageTitle = computed(() => {
  const item = menuItems.value.find(item => {
    if (item.exact) {
      return route.path === item.path
    }
    return route.path.startsWith(item.path)
  })
  return item?.label
})

const isActiveRoute = (item) => {
  if (item.exact) {
    return route.path === item.path
  }
  // Pour éviter que /admin soit actif sur toutes les pages
  if (item.path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(item.path)
}

const handleLogout = async () => {
  if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
