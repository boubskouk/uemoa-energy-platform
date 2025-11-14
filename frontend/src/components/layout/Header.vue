<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo UEMOA et titre -->
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <!-- Logo UEMOA -->
          <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-yellow-500 rounded-lg shadow-md">
            <svg viewBox="0 0 100 100" class="w-8 h-8">
              <!-- Étoiles UEMOA (8 pays) -->
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
              <!-- Cercle central -->
              <circle cx="50" cy="50" r="15" fill="none" stroke="white" stroke-width="2"/>
              <!-- Feuille (énergie verte) -->
              <path d="M50 45 Q 55 35 50 30 Q 45 35 50 45" fill="white"/>
            </svg>
          </div>

          <div>
            <h1 class="text-xl font-heading font-bold text-gray-900">
              UEMOA Energy
            </h1>
            <p class="text-xs text-gray-600">Répertoire des acteurs</p>
          </div>
        </router-link>

        <!-- Barre de recherche (desktop uniquement) -->
        <div class="hidden lg:block flex-1 max-w-xl mx-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keydown.enter="performSearch"
              type="text"
              placeholder="Rechercher..."
              class="w-full px-10 py-2 border border-gray-300 rounded-lg focus:border-primary-green focus:outline-none text-sm"
            />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Navigation desktop -->
        <div class="hidden md:flex items-center gap-4">
          <router-link
            to="/"
            class="nav-link"
            active-class="nav-link-active"
          >
            🏠 Accueil
          </router-link>

          <router-link
            to="/actors"
            class="nav-link"
            active-class="nav-link-active"
          >
            👥 Acteurs
          </router-link>

          <router-link
            to="/news"
            class="nav-link"
            active-class="nav-link-active"
          >
            📰 Actualités
          </router-link>

          <router-link
            to="/events"
            class="nav-link"
            active-class="nav-link-active"
          >
            📅 Événements
          </router-link>

          <!-- Bouton de connexion -->
          <router-link
            to="/login"
            class="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors font-medium text-sm"
          >
            Se connecter
          </router-link>
        </div>

        <!-- Bouton menu mobile -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            v-if="!mobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Menu mobile -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden py-4 border-t border-gray-200"
      >
        <div class="flex flex-col gap-2">
          <router-link
            to="/"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            🏠 Accueil
          </router-link>

          <router-link
            to="/actors"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            👥 Acteurs
          </router-link>

          <router-link
            to="/news"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            📰 Actualités
          </router-link>

          <router-link
            to="/events"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            📅 Événements
          </router-link>

          <router-link
            to="/login"
            class="mt-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors font-medium text-sm text-center"
            @click="closeMobileMenu"
          >
            Se connecter
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mobileMenuOpen = ref(false)
const searchQuery = ref('')

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const performSearch = () => {
  if (!searchQuery.value.trim()) return

  router.push({
    path: '/search',
    query: { q: searchQuery.value }
  })
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-primary-green font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50;
}

.nav-link-active {
  @apply text-primary-green bg-primary-green/10;
}

.mobile-nav-link {
  @apply block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors;
}

.mobile-nav-link.router-link-active {
  @apply text-primary-green bg-primary-green/10;
}
</style>
