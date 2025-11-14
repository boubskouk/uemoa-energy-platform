<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-900">Inscription</h1>
        <p class="mt-2 text-gray-600">Créez votre compte UEMOA Energy Platform</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <!-- Prénom -->
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
            Prénom
          </label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Votre prénom"
          />
        </div>

        <!-- Nom -->
        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Votre nom"
          />
        </div>

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
          <p class="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage" class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p class="font-semibold">✅ {{ successMessage }}</p>
          <p class="text-sm">Redirection vers la page de connexion...</p>
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>

        <!-- Bouton d'inscription -->
        <button
          @click="handleRegister"
          class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          S'inscrire
        </button>

        <!-- Liens -->
        <div class="mt-6 text-center text-sm">
          <p class="text-gray-600">
            Vous avez déjà un compte ?
            <router-link to="/login" class="text-green-600 hover:underline font-medium">
              Se connecter
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
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  console.log('🔵 handleRegister CALLED')
  console.log('📧 Email:', form.value.email)
  console.log('👤 Nom:', form.value.firstName, form.value.lastName)

  errorMessage.value = ''
  successMessage.value = ''

  // Validation
  if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.password) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    alert('Veuillez remplir tous les champs')
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 6 caractères'
    alert('Le mot de passe doit contenir au moins 6 caractères')
    return
  }

  try {
    console.log('🔄 Appel de authStore.register...')
    const result = await authStore.register({
      email: form.value.email,
      password: form.value.password,
      profile: {
        firstName: form.value.firstName,
        lastName: form.value.lastName
      }
    })
    console.log('📦 Résultat:', result)

    if (result && result.success) {
      console.log('✅ Inscription réussie!')
      successMessage.value = 'Inscription validée !'
      alert('✅ Inscription validée ! Redirection vers la page de connexion...')

      setTimeout(() => {
        console.log('🚀 Redirection vers /login...')
        router.push('/login')
      }, 2000)
    } else {
      console.log('❌ Échec de l\'inscription')
      errorMessage.value = result?.error || 'Erreur d\'inscription'
      alert('❌ Échec: ' + errorMessage.value)
    }
  } catch (error) {
    console.error('💥 Erreur:', error)
    errorMessage.value = 'Erreur: ' + error.message
    alert('💥 ERREUR: ' + error.message)
  }
}
</script>
