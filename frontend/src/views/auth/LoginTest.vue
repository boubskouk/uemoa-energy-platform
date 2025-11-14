<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-900">TEST Connexion</h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <button @click="testClick" class="w-full btn-primary mb-4">
          Test Click
        </button>

        <div v-if="message" class="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          {{ message }}
        </div>

        <form @submit.prevent="handleSubmit">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="input-field mb-4"
          />

          <button type="submit" class="w-full btn-primary">
            Soumettre
          </button>
        </form>

        <div v-if="submitted" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Formulaire soumis ! Email: {{ email }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('')
const email = ref('')
const submitted = ref(false)

const testClick = () => {
  console.log('Button clicked!')
  message.value = 'Bouton cliqué ! JavaScript fonctionne.'
}

const handleSubmit = () => {
  console.log('Form submitted!')
  console.log('Email:', email.value)
  submitted.value = true
}
</script>
