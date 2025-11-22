<template>
  <div class="space-y-6">
    <!-- Titre -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
      <p class="text-gray-600">Gérez les paramètres de l'application</p>
    </div>

    <!-- Messages de succès/erreur -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ errorMessage }}
    </div>

    <!-- Section: Paramètres généraux -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Paramètres généraux</h2>
      <form @submit.prevent="saveGeneralSettings" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nom de la plateforme</label>
          <input
            v-model="generalSettings.platformName"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-primary-green"
            placeholder="UEMOA Energy Platform"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
          <input
            v-model="generalSettings.contactEmail"
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-primary-green"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description de la plateforme</label>
          <textarea
            v-model="generalSettings.platformDescription"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-primary-green"
            placeholder="Description de la plateforme..."
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            v-model="generalSettings.maintenanceMode"
            type="checkbox"
            id="maintenanceMode"
            class="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
          <label for="maintenanceMode" class="ml-2 block text-sm text-gray-700">
            Mode maintenance
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
    </div>

    <!-- Section: Paramètres de notification -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
      <form @submit.prevent="saveNotificationSettings" class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p class="font-medium text-gray-900">Nouveaux acteurs</p>
            <p class="text-sm text-gray-600">Recevoir une notification lors de l'ajout d'un nouvel acteur</p>
          </div>
          <input
            v-model="notificationSettings.newActors"
            type="checkbox"
            class="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p class="font-medium text-gray-900">Nouvelles actualités</p>
            <p class="text-sm text-gray-600">Recevoir une notification lors de la publication d'une actualité</p>
          </div>
          <input
            v-model="notificationSettings.newNews"
            type="checkbox"
            class="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p class="font-medium text-gray-900">Nouveaux événements</p>
            <p class="text-sm text-gray-600">Recevoir une notification lors de la création d'un événement</p>
          </div>
          <input
            v-model="notificationSettings.newEvents"
            type="checkbox"
            class="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium text-gray-900">Nouveaux utilisateurs</p>
            <p class="text-sm text-gray-600">Recevoir une notification lors de l'inscription d'un utilisateur</p>
          </div>
          <input
            v-model="notificationSettings.newUsers"
            type="checkbox"
            class="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
    </div>

    <!-- Section: Sécurité -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Sécurité</h2>
      <form @submit.prevent="saveSecuritySettings" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Durée de validité du token (en heures)
          </label>
          <input
            v-model.number="securitySettings.tokenExpiry"
            type="number"
            min="1"
            max="720"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-primary-green"
          />
        </div>

        <div class="flex items-center">
          <input
            v-model="securitySettings.requireEmailVerification"
            type="checkbox"
            id="emailVerification"
            class="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
          <label for="emailVerification" class="ml-2 block text-sm text-gray-700">
            Exiger la vérification de l'email lors de l'inscription
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="securitySettings.requireAdminApproval"
            type="checkbox"
            id="adminApproval"
            class="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
          <label for="adminApproval" class="ml-2 block text-sm text-gray-700">
            Exiger l'approbation admin pour les nouveaux comptes
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
    </div>

    <!-- Section: Statistiques -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Informations système</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">Version de l'application</p>
          <p class="text-lg font-semibold text-gray-900">1.0.0</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">Base de données</p>
          <p class="text-lg font-semibold text-gray-900">PostgreSQL</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">Dernière mise à jour</p>
          <p class="text-lg font-semibold text-gray-900">{{ new Date().toLocaleDateString('fr-FR') }}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">Environnement</p>
          <p class="text-lg font-semibold text-gray-900">{{ environment }}</p>
        </div>
      </div>
    </div>

    <!-- Section: Actions -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Actions</h2>
      <div class="space-y-3">
        <button
          @click="clearCache"
          class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Vider le cache
        </button>
        <button
          @click="exportData"
          class="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-0 md:ml-3"
        >
          Exporter les données
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const environment = ref('development')

// Paramètres généraux
const generalSettings = ref({
  platformName: 'UEMOA Energy Platform',
  contactEmail: 'contact@uemoa-energy.org',
  platformDescription: 'Plateforme de référencement des acteurs de l\'énergie dans l\'espace UEMOA',
  maintenanceMode: false
})

// Paramètres de notification
const notificationSettings = ref({
  newActors: true,
  newNews: true,
  newEvents: true,
  newUsers: true
})

// Paramètres de sécurité
const securitySettings = ref({
  tokenExpiry: 24,
  requireEmailVerification: false,
  requireAdminApproval: true
})

// Sauvegarder les paramètres généraux
const saveGeneralSettings = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simuler un appel API (à remplacer par un vrai appel)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Sauvegarder dans le localStorage (temporaire)
    localStorage.setItem('generalSettings', JSON.stringify(generalSettings.value))

    successMessage.value = 'Paramètres généraux enregistrés avec succès'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'enregistrement des paramètres'
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Sauvegarder les paramètres de notification
const saveNotificationSettings = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings.value))

    successMessage.value = 'Paramètres de notification enregistrés avec succès'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'enregistrement des paramètres'
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Sauvegarder les paramètres de sécurité
const saveSecuritySettings = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings.value))

    successMessage.value = 'Paramètres de sécurité enregistrés avec succès'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'enregistrement des paramètres'
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// Vider le cache
const clearCache = () => {
  if (confirm('Voulez-vous vraiment vider le cache ?')) {
    localStorage.removeItem('generalSettings')
    localStorage.removeItem('notificationSettings')
    localStorage.removeItem('securitySettings')
    successMessage.value = 'Cache vidé avec succès'
    setTimeout(() => { successMessage.value = '' }, 3000)
  }
}

// Exporter les données
const exportData = () => {
  const data = {
    generalSettings: generalSettings.value,
    notificationSettings: notificationSettings.value,
    securitySettings: securitySettings.value,
    exportDate: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `settings-export-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)

  successMessage.value = 'Données exportées avec succès'
  setTimeout(() => { successMessage.value = '' }, 3000)
}

// Charger les paramètres au montage
onMounted(() => {
  // Charger depuis le localStorage si disponible
  const savedGeneral = localStorage.getItem('generalSettings')
  if (savedGeneral) {
    generalSettings.value = JSON.parse(savedGeneral)
  }

  const savedNotifications = localStorage.getItem('notificationSettings')
  if (savedNotifications) {
    notificationSettings.value = JSON.parse(savedNotifications)
  }

  const savedSecurity = localStorage.getItem('securitySettings')
  if (savedSecurity) {
    securitySettings.value = JSON.parse(savedSecurity)
  }
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
