<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-2xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-900">Connexion DEBUG</h1>
        <p class="mt-2 text-gray-600">Mode debug pour diagnostiquer les problèmes de connexion</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="admin@uemoa-energy.org"
          />
        </div>

        <!-- Mot de passe -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Admin@2025!"
          />
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage" class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p class="font-semibold">{{ successMessage }}</p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>

        <!-- Logs de debug -->
        <div v-if="logs.length > 0" class="mb-4 bg-gray-100 border border-gray-300 p-4 rounded max-h-96 overflow-y-auto">
          <h3 class="font-bold mb-2">Logs de debug :</h3>
          <div v-for="(log, index) in logs" :key="index" class="text-xs mb-1 font-mono" :class="getLogClass(log.type)">
            {{ log.message }}
          </div>
        </div>

        <!-- Boutons -->
        <div class="space-y-3">
          <button
            @click="testDirectFetch"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Test 1: Fetch Direct (sans Axios)
          </button>

          <button
            @click="testWithAxios"
            class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Test 2: Axios Direct
          </button>

          <button
            @click="testWithStore"
            class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Test 3: Via Auth Store
          </button>

          <button
            @click="clearLogs"
            class="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Effacer les logs
          </button>
        </div>

        <!-- Info localStorage -->
        <div class="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <h3 class="font-bold mb-2">LocalStorage :</h3>
          <p class="text-sm"><strong>Token:</strong> {{ hasToken ? '✅ Présent' : '❌ Absent' }}</p>
          <p class="text-sm"><strong>User:</strong> {{ hasUser ? '✅ Présent' : '❌ Absent' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: 'admin@uemoa-energy.org',
  password: 'Admin@2025!'
})

const successMessage = ref('')
const errorMessage = ref('')
const logs = ref([])

// Computed pour vérifier localStorage
const hasToken = computed(() => !!localStorage.getItem('token'))
const hasUser = computed(() => !!localStorage.getItem('user'))

const addLog = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push({ message: `[${timestamp}] ${message}`, type })
  console.log(`[${type.toUpperCase()}] ${message}`)
}

const getLogClass = (type) => {
  switch (type) {
    case 'success': return 'text-green-700'
    case 'error': return 'text-red-700'
    case 'warning': return 'text-yellow-700'
    default: return 'text-gray-700'
  }
}

const clearLogs = () => {
  logs.value = []
  successMessage.value = ''
  errorMessage.value = ''
}

// Test 1: Fetch direct
const testDirectFetch = async () => {
  clearLogs()
  addLog('=== TEST 1: FETCH DIRECT ===')

  try {
    addLog(`Email: ${form.value.email}`)
    addLog(`Password length: ${form.value.password.length}`)

    const url = 'http://localhost:5000/api/auth/login'
    addLog(`URL: ${url}`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      })
    })

    addLog(`Response status: ${response.status}`)
    addLog(`Response ok: ${response.ok}`)

    const data = await response.json()
    addLog(`Response data: ${JSON.stringify(data, null, 2)}`, 'info')

    if (response.ok && data.success) {
      addLog('Token reçu: ' + data.token.substring(0, 30) + '...', 'success')
      addLog('User: ' + JSON.stringify(data.user), 'success')
      successMessage.value = 'Fetch direct: SUCCÈS !'

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      addLog('Données sauvegardées dans localStorage', 'success')
    } else {
      addLog('Erreur: ' + (data.message || 'Inconnue'), 'error')
      errorMessage.value = data.message || 'Erreur inconnue'
    }
  } catch (error) {
    addLog('ERREUR: ' + error.message, 'error')
    addLog('Stack: ' + error.stack, 'error')
    errorMessage.value = error.message
  }
}

// Test 2: Axios direct
const testWithAxios = async () => {
  clearLogs()
  addLog('=== TEST 2: AXIOS DIRECT ===')

  try {
    const url = 'http://localhost:5000/api/auth/login'
    addLog(`URL: ${url}`)

    const response = await axios.post(url, {
      email: form.value.email,
      password: form.value.password
    })

    addLog(`Response status: ${response.status}`, 'success')
    addLog(`Response data: ${JSON.stringify(response.data, null, 2)}`)

    if (response.data.success) {
      addLog('SUCCESS reçu!', 'success')
      addLog('Token: ' + response.data.token.substring(0, 30) + '...', 'success')
      successMessage.value = 'Axios direct: SUCCÈS !'

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } else {
      addLog('Pas de success dans la réponse', 'warning')
      errorMessage.value = 'Response.data.success est false'
    }
  } catch (error) {
    addLog('ERREUR: ' + error.message, 'error')
    if (error.response) {
      addLog(`Response status: ${error.response.status}`, 'error')
      addLog(`Response data: ${JSON.stringify(error.response.data)}`, 'error')
    }
    errorMessage.value = error.response?.data?.message || error.message
  }
}

// Test 3: Via le store
const testWithStore = async () => {
  clearLogs()
  addLog('=== TEST 3: VIA AUTH STORE ===')

  try {
    addLog('Appel de authStore.login()')
    const result = await authStore.login(form.value)

    addLog(`Result: ${JSON.stringify(result, null, 2)}`)

    if (result && result.success) {
      addLog('Store login: SUCCESS!', 'success')
      successMessage.value = 'Store login: SUCCÈS ! Redirection...'

      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } else {
      addLog('Store login: ÉCHEC', 'error')
      addLog('Error: ' + (result?.error || 'Inconnue'), 'error')
      errorMessage.value = result?.error || 'Erreur inconnue'
    }
  } catch (error) {
    addLog('ERREUR: ' + error.message, 'error')
    errorMessage.value = error.message
  }
}
</script>
