<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <router-link
            to="/profile"
            class="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {{ $t('profileEdit.back') }}
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('profileEdit.title') }}</h1>
        </div>

        <!-- Edit Form -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('profileEdit.form.name') }} *
              </label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('profileEdit.form.email') }} *
              </label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <!-- Divider -->
            <hr class="my-8" />

            <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('profileEdit.changePassword') }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ $t('profileEdit.passwordHint') }}</p>

            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('profileEdit.form.currentPassword') }}
              </label>
              <input
                v-model="form.currentPassword"
                type="password"
                id="currentPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.currentPassword }"
              />
              <p v-if="errors.currentPassword" class="text-red-500 text-sm mt-1">{{ errors.currentPassword }}</p>
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('profileEdit.form.newPassword') }}
              </label>
              <input
                v-model="form.newPassword"
                type="password"
                id="newPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.newPassword }"
              />
              <p v-if="errors.newPassword" class="text-red-500 text-sm mt-1">{{ errors.newPassword }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('profileEdit.form.confirmPassword') }}
              </label>
              <input
                v-model="form.confirmPassword"
                type="password"
                id="confirmPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {{ successMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {{ errorMessage }}
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">{{ $t('profileEdit.form.save') }}</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ $t('profileEdit.form.saving') }}
                </span>
              </button>
              <router-link
                to="/profile"
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition text-center"
              >
                {{ $t('profileEdit.form.cancel') }}
              </router-link>
            </div>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
          <h3 class="text-lg font-bold text-red-900 mb-2">{{ $t('profileEdit.dangerZone.title') }}</h3>
          <p class="text-red-700 mb-4">{{ $t('profileEdit.dangerZone.description') }}</p>
          <button
            @click="showDeleteModal = true"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {{ $t('profileEdit.dangerZone.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('profileEdit.deleteModal.title') }}</h3>
        <p class="text-gray-700 mb-6">{{ $t('profileEdit.deleteModal.warning') }}</p>
        <div class="flex gap-4">
          <button
            @click="handleDeleteAccount"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {{ $t('profileEdit.deleteModal.confirm') }}
          </button>
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            {{ $t('profileEdit.deleteModal.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = ref({})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showDeleteModal = ref(false)

const validateForm = () => {
  errors.value = {}

  if (!form.value.name || form.value.name.length < 2) {
    errors.value.name = t('profileEdit.errors.name')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email || !emailRegex.test(form.value.email)) {
    errors.value.email = t('profileEdit.errors.email')
  }

  // Validation du mot de passe seulement si l'utilisateur veut le changer
  if (form.value.newPassword || form.value.currentPassword || form.value.confirmPassword) {
    if (!form.value.currentPassword) {
      errors.value.currentPassword = t('profileEdit.errors.currentPassword')
    }

    if (!form.value.newPassword || form.value.newPassword.length < 6) {
      errors.value.newPassword = t('profileEdit.errors.newPassword')
    }

    if (form.value.newPassword !== form.value.confirmPassword) {
      errors.value.confirmPassword = t('profileEdit.errors.confirmPassword')
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const updateData = {
      name: form.value.name,
      email: form.value.email
    }

    // Ajouter le changement de mot de passe si demandé
    if (form.value.currentPassword && form.value.newPassword) {
      updateData.currentPassword = form.value.currentPassword
      updateData.newPassword = form.value.newPassword
    }

    // TODO: Remplacer par l'appel API réel
    await new Promise(resolve => setTimeout(resolve, 1500))
    // const response = await api.put(`/users/${authStore.user._id}`, updateData)

    // Simuler la mise à jour du store
    authStore.user.name = form.value.name
    authStore.user.email = form.value.email

    successMessage.value = t('profileEdit.success')

    // Réinitialiser les champs de mot de passe
    form.value.currentPassword = ''
    form.value.newPassword = ''
    form.value.confirmPassword = ''

    // Rediriger après succès
    setTimeout(() => {
      router.push('/profile')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || t('profileEdit.error')
  } finally {
    loading.value = false
  }
}

const handleDeleteAccount = async () => {
  try {
    // TODO: Implémenter l'appel API réel
    // await api.delete(`/users/${authStore.user._id}`)

    alert(t('profileEdit.deleteModal.success'))
    authStore.logout()
    router.push('/')
  } catch (error) {
    alert(error.response?.data?.message || t('profileEdit.deleteModal.error'))
  }
  showDeleteModal.value = false
}

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name || ''
    form.value.email = authStore.user.email || ''
  }
})
</script>
