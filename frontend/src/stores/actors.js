import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import actorsService from '../services/actors.service'

export const useActorsStore = defineStore('actors', () => {
  // State
  const actors = ref([])
  const currentActor = ref(null)
  const myActor = ref(null)
  const pendingActors = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Pagination
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  // Filtres
  const filters = ref({
    country: null,
    type: null,
    category: null,
    energy: null,
    search: '',
    featured: null,
    verified: null
  })

  // Getters
  const hasActors = computed(() => actors.value.length > 0)
  const featuredActors = computed(() => actors.value.filter(a => a.featured))

  // Actions
  const fetchActors = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await actorsService.getAll({
        ...filters.value,
        ...params,
        page: pagination.value.page,
        limit: pagination.value.limit
      })

      actors.value = response.data.data
      pagination.value = {
        page: response.data.page,
        limit: response.data.limit || 20,
        total: response.data.total,
        pages: response.data.pages
      }

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des acteurs'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchActorById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await actorsService.getById(id)
      currentActor.value = response.data.data
      return { success: true, data: currentActor.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Acteur non trouvé'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchMyActor = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await actorsService.getMyActor()
      myActor.value = response.data.data
      return { success: true, data: myActor.value }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement de votre profil'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createActor = async (data) => {
    loading.value = true
    error.value = null

    try {
      const response = await actorsService.create(data)
      myActor.value = response.data.data
      return { success: true, data: response.data.data, message: response.data.message }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de l\'acteur'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateActor = async (id, data) => {
    loading.value = true
    error.value = null

    try {
      const response = await actorsService.update(id, data)

      // Mettre à jour dans la liste
      const index = actors.value.findIndex(a => a._id === id)
      if (index !== -1) {
        actors.value[index] = response.data.data
      }

      // Mettre à jour currentActor si c'est celui-là
      if (currentActor.value?._id === id) {
        currentActor.value = response.data.data
      }

      // Mettre à jour myActor si c'est le mien
      if (myActor.value?._id === id) {
        myActor.value = response.data.data
      }

      return { success: true, data: response.data.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteActor = async (id) => {
    loading.value = true
    error.value = null

    try {
      await actorsService.delete(id)

      // Retirer de la liste
      actors.value = actors.value.filter(a => a._id !== id)

      if (myActor.value?._id === id) {
        myActor.value = null
      }

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchPendingActors = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await actorsService.getPending()
      pendingActors.value = response.data.data
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const approveActor = async (id) => {
    loading.value = true
    error.value = null

    try {
      await actorsService.approve(id)

      // Retirer de la liste pending
      pendingActors.value = pendingActors.value.filter(a => a._id !== id)

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'approbation'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const rejectActor = async (id, reason) => {
    loading.value = true
    error.value = null

    try {
      await actorsService.reject(id, reason)

      // Retirer de la liste pending
      pendingActors.value = pendingActors.value.filter(a => a._id !== id)

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du rejet'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      country: null,
      type: null,
      category: null,
      energy: null,
      search: '',
      featured: null,
      verified: null
    }
  }

  const setPage = (page) => {
    pagination.value.page = page
  }

  return {
    // State
    actors,
    currentActor,
    myActor,
    pendingActors,
    loading,
    error,
    pagination,
    filters,
    // Getters
    hasActors,
    featuredActors,
    // Actions
    fetchActors,
    fetchActorById,
    fetchMyActor,
    createActor,
    updateActor,
    deleteActor,
    fetchPendingActors,
    approveActor,
    rejectActor,
    setFilters,
    resetFilters,
    setPage
  }
})
