<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="flex items-center gap-4">
      <router-link to="/admin/actors" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEdit ? 'Modifier un Acteur' : 'Créer un Acteur' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isEdit ? 'Modifiez les informations de l\'acteur' : 'Ajoutez un nouvel acteur à la plateforme' }}
        </p>
      </div>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Informations générales -->
      <div class="card-modern">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Informations générales</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'acteur *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input-modern"
              placeholder="Ex: Énergie Verte Bénin"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-modern"
              placeholder="contact@exemple.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="input-modern"
              placeholder="+226 XX XX XX XX"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            <input
              v-model="form.website"
              type="url"
              class="input-modern"
              placeholder="https://www.exemple.com"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="input-modern"
            placeholder="Décrivez l'acteur et ses activités..."
          ></textarea>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex items-center justify-end gap-4">
        <router-link
          to="/admin/actors"
          class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Annuler
        </router-link>
        <button
          type="submit"
          class="btn-gradient"
        >
          {{ isEdit ? 'Mettre à jour' : 'Créer l\'acteur' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  email: '',
  phone: '',
  website: '',
  description: ''
})

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/actors/${route.params.id}`, form.value)
      alert('Acteur modifié avec succès!')
    } else {
      await api.post('/actors', form.value)
      alert('Acteur créé avec succès!')
    }
    router.push('/admin/actors')
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de l\'enregistrement de l\'acteur')
  }
}

const loadActor = async () => {
  if (!isEdit.value) return

  try {
    const response = await api.get(`/actors/${route.params.id}`)
    const actor = response.data.actor

    form.value = {
      name: actor.name || '',
      email: actor.email || '',
      phone: actor.phone || '',
      website: actor.website || '',
      description: actor.description || ''
    }
  } catch (error) {
    console.error('Erreur chargement acteur:', error)
  }
}

onMounted(() => {
  loadActor()
})
</script>
