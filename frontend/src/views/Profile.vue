<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="user" class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div class="h-32 bg-gradient-to-r from-green-600 to-blue-600"></div>
          <div class="px-6 pb-6">
            <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-4xl sm:text-5xl font-bold text-white bg-green-600">
                {{ userInitials }}
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ user.name }}</h1>
                <p class="text-gray-600">{{ user.email }}</p>
                <div class="mt-2">
                  <span class="inline-block px-3 py-1 text-sm font-semibold rounded-full"
                    :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                    {{ user.role === 'admin' ? $t('profile.admin') : $t('profile.user') }}
                  </span>
                </div>
              </div>
              <div class="mt-4 sm:mt-0">
                <router-link
                  to="/profile/edit"
                  class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  {{ $t('profile.edit') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-lg mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="py-4 px-1 border-b-2 font-medium text-sm transition"
                :class="activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Information Tab -->
            <div v-if="activeTab === 'info'" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.info.name') }}</label>
                  <p class="text-gray-900">{{ user.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.info.email') }}</label>
                  <p class="text-gray-900">{{ user.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.info.role') }}</label>
                  <p class="text-gray-900">{{ user.role === 'admin' ? $t('profile.admin') : $t('profile.user') }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.info.joinDate') }}</label>
                  <p class="text-gray-900">{{ formatDate(user.createdAt) }}</p>
                </div>
              </div>
            </div>

            <!-- My Actor Tab -->
            <div v-if="activeTab === 'actor'">
              <div v-if="myActor">
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">{{ myActor.name }}</h3>
                    <p class="text-gray-600">{{ myActor.type }}</p>
                  </div>
                  <span class="px-3 py-1 text-sm font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': myActor.status === 'approved',
                      'bg-yellow-100 text-yellow-800': myActor.status === 'pending',
                      'bg-red-100 text-red-800': myActor.status === 'rejected'
                    }">
                    {{ $t(`profile.actor.status.${myActor.status}`) }}
                  </span>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.actor.country') }}</label>
                    <p class="text-gray-900">{{ myActor.country?.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.actor.city') }}</label>
                    <p class="text-gray-900">{{ myActor.address?.city }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.actor.views') }}</label>
                    <p class="text-gray-900">{{ myActor.views || 0 }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.actor.contacts') }}</label>
                    <p class="text-gray-900">{{ myActor.contactCount || 0 }}</p>
                  </div>
                </div>

                <div class="mt-6 flex gap-3">
                  <router-link
                    :to="`/actors/${myActor._id}`"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {{ $t('profile.actor.view') }}
                  </router-link>
                  <router-link
                    :to="`/admin/actors/edit/${myActor._id}`"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    {{ $t('profile.actor.edit') }}
                  </router-link>
                </div>
              </div>

              <div v-else class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">{{ $t('profile.actor.noActor') }}</h3>
                <p class="mt-2 text-gray-600">{{ $t('profile.actor.createPrompt') }}</p>
                <div class="mt-6">
                  <router-link
                    to="/actors/create"
                    class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    {{ $t('profile.actor.create') }}
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Activity Tab -->
            <div v-if="activeTab === 'activity'">
              <div class="text-center py-12 text-gray-600">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p class="mt-4">{{ $t('profile.activity.noActivity') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('profile.actions.title') }}</h3>
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="handleLogout"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              {{ $t('profile.actions.logout') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-600">{{ $t('profile.error') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useActorsStore } from '../stores/actors'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const actorsStore = useActorsStore()

const loading = ref(true)
const activeTab = ref('info')

const tabs = computed(() => [
  { id: 'info', name: t('profile.tabs.info') },
  { id: 'actor', name: t('profile.tabs.actor') },
  { id: 'activity', name: t('profile.tabs.activity') }
])

const user = computed(() => authStore.user)
const myActor = computed(() => actorsStore.myActor)

const userInitials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  loading.value = true
  try {
    // Charger le profil acteur si disponible
    await actorsStore.fetchMyActor()
  } catch (error) {
    console.error('Error loading profile:', error)
  } finally {
    loading.value = false
  }
})
</script>
