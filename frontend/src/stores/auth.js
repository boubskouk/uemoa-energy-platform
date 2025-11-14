import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isActor = computed(() => user.value?.role === 'actor')

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', credentials)
      console.log('Login response:', response.data)

      const { token: authToken, user: userData } = response.data

      // Sauvegarder dans localStorage
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))

      // Mettre à jour l'état
      token.value = authToken
      user.value = userData

      return { success: true, data: response.data }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || 'Erreur de connexion'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/register', userData)
      console.log('Register response:', response.data)

      return { success: true, data: response.data }
    } catch (err) {
      console.error('Register error:', err)
      error.value = err.response?.data?.message || 'Erreur d\'inscription'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    // Supprimer de localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Réinitialiser l'état
    token.value = null
    user.value = null
    error.value = null
  }

  const checkAuth = () => {
    // Vérifier si l'utilisateur est connecté au chargement de l'app
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err)
      logout()
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isActor,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    fetchCurrentUser
  }
})
