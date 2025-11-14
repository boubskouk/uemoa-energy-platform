<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-900">Connexion</h1>
        <p class="mt-2 text-gray-600">Accédez à votre compte UEMOA Energy Platform</p>
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
            placeholder="votre@email.com"
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
            placeholder="••••••••"
          />
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage" class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p class="font-semibold">✅ {{ successMessage }}</p>
          <p class="text-sm">Redirection vers la page d'accueil...</p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>

        <!-- Bouton de connexion -->
        <button
          @click="handleLogin"
          class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          Se connecter
        </button>

        <!-- Liens -->
        <div class="mt-6 text-center text-sm">
          <p class="text-gray-600">
            Pas encore de compte ?
            <router-link to="/register" class="text-green-600 hover:underline font-medium">
              S'inscrire
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  console.log('🔵 handleLogin CALLED')
  console.log('📧 Email:', form.value.email)
  console.log('🔑 Password:', form.value.password)

  alert('CLICK DETECTE! Email: ' + form.value.email)

  errorMessage.value = ''
  successMessage.value = ''

  // Validation
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    alert('Champs vides!')
    return
  }

  try {
    console.log('🔄 Appel de authStore.login...')
    const result = await authStore.login(form.value)
    console.log('📦 Résultat:', result)

    if (result && result.success) {
      console.log('✅ Connexion réussie!')
      successMessage.value = 'Connexion réussie !'
      alert('Connexion réussie! Redirection dans 1.5s')

      setTimeout(() => {
        console.log('🚀 Redirection...')
        router.push('/')
      }, 1500)
    } else {
      console.log('❌ Échec de connexion')
      errorMessage.value = result?.error || 'Erreur de connexion'
      alert('Échec: ' + errorMessage.value)
    }
  } catch (error) {
    console.error('💥 Erreur:', error)
    errorMessage.value = 'Erreur: ' + error.message
    alert('ERREUR: ' + error.message)
  }
}
</script>
