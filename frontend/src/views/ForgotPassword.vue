<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('forgotPassword.title') }}</h1>
        <p class="mt-2 text-gray-600">{{ $t('forgotPassword.subtitle') }}</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('forgotPassword.form.email') }} *
            </label>
            <input
              v-model="email"
              type="email"
              id="email"
              required
              autofocus
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="{ 'border-red-500': error }"
              :placeholder="$t('forgotPassword.form.emailPlaceholder')"
            />
            <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <span v-if="!loading">{{ $t('forgotPassword.form.submit') }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('forgotPassword.form.sending') }}
            </span>
          </button>

          <!-- Back to Login -->
          <div class="text-center">
            <router-link to="/login" class="text-green-600 hover:text-green-700 text-sm">
              {{ $t('forgotPassword.backToLogin') }}
            </router-link>
          </div>
        </form>

        <!-- Success Message -->
        <div v-else class="text-center py-4">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ $t('forgotPassword.success.title') }}</h3>
          <p class="text-gray-600 mb-6">{{ $t('forgotPassword.success.message') }}</p>
          <p class="text-sm text-gray-500 mb-4">{{ email }}</p>
          <router-link
            to="/login"
            class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {{ $t('forgotPassword.success.backToLogin') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../services/api'

const { t } = useI18n()

const email = ref('')
const loading = ref(false)
const error = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    // TODO: Implémenter l'appel API réel
    await new Promise(resolve => setTimeout(resolve, 1500))
    // await api.post('/auth/forgot-password', { email: email.value })

    emailSent.value = true
  } catch (err) {
    error.value = err.response?.data?.message || t('forgotPassword.error')
  } finally {
    loading.value = false
  }
}
</script>
