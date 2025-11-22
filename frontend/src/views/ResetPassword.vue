<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('resetPassword.title') }}</h1>
        <p class="mt-2 text-gray-600">{{ $t('resetPassword.subtitle') }}</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <form v-if="!resetSuccess" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- New Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('resetPassword.form.newPassword') }} *
            </label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              required
              autofocus
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ $t('resetPassword.form.passwordHint') }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('resetPassword.form.confirmPassword') }} *
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              id="confirmPassword"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <span v-if="!loading">{{ $t('resetPassword.form.submit') }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('resetPassword.form.resetting') }}
            </span>
          </button>
        </form>

        <!-- Success Message -->
        <div v-else class="text-center py-4">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ $t('resetPassword.success.title') }}</h3>
          <p class="text-gray-600 mb-6">{{ $t('resetPassword.success.message') }}</p>
          <router-link
            to="/login"
            class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {{ $t('resetPassword.success.login') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../services/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const form = ref({
  password: '',
  confirmPassword: ''
})

const errors = ref({})
const loading = ref(false)
const errorMessage = ref('')
const resetSuccess = ref(false)
const token = ref('')

const validateForm = () => {
  errors.value = {}

  if (!form.value.password || form.value.password.length < 6) {
    errors.value.password = t('resetPassword.errors.password')
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = t('resetPassword.errors.confirmPassword')
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // TODO: Implémenter l'appel API réel
    await new Promise(resolve => setTimeout(resolve, 1500))
    // await api.post('/auth/reset-password', {
    //   token: token.value,
    //   password: form.value.password
    // })

    resetSuccess.value = true
  } catch (err) {
    errorMessage.value = err.response?.data?.message || t('resetPassword.error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  token.value = route.params.token || ''
  if (!token.value) {
    router.push('/login')
  }
})
</script>
