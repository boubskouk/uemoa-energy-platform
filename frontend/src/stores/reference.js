import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import countriesService from '../services/countries.service'
import categoriesService from '../services/categories.service'
import energiesService from '../services/energies.service'

export const useReferenceStore = defineStore('reference', () => {
  // State
  const countries = ref([])
  const categories = ref([])
  const energies = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  // Getters
  const getCountryById = computed(() => {
    return (id) => countries.value.find(c => c._id === id)
  })

  const getCategoryById = computed(() => {
    return (id) => categories.value.find(c => c._id === id)
  })

  const getEnergyById = computed(() => {
    return (id) => energies.value.find(e => e._id === id)
  })

  // Actions
  const fetchAll = async () => {
    if (loaded.value) return { success: true }

    loading.value = true

    try {
      const [countriesRes, categoriesRes, energiesRes] = await Promise.all([
        countriesService.getAll(),
        categoriesService.getAll(),
        energiesService.getAll()
      ])

      countries.value = countriesRes.data.data
      categories.value = categoriesRes.data.data
      energies.value = energiesRes.data.data

      loaded.value = true

      return { success: true }
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await countriesService.getAll()
      countries.value = response.data.data
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoriesService.getAll()
      categories.value = response.data.data
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const fetchEnergies = async () => {
    try {
      const response = await energiesService.getAll()
      energies.value = response.data.data
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    // State
    countries,
    categories,
    energies,
    loading,
    loaded,
    // Getters
    getCountryById,
    getCategoryById,
    getEnergyById,
    // Actions
    fetchAll,
    fetchCountries,
    fetchCategories,
    fetchEnergies
  }
})
