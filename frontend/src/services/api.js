import axios from 'axios'

// Créer une instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
})

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    // Ajouter le token JWT si disponible
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Gestion des erreurs
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      switch (error.response.status) {
        case 401:
          // Non autorisé - Rediriger vers login seulement si ce n'est pas une tentative de login
          if (!error.config.url.includes('/auth/login')) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          }
          break
        case 403:
          // Accès interdit
          console.error('Accès refusé')
          break
        case 404:
          // Ressource non trouvée
          console.error('Ressource non trouvée')
          break
        case 500:
          // Erreur serveur
          console.error('Erreur serveur')
          break
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Pas de réponse du serveur')
    } else {
      // Quelque chose s'est mal passé lors de la configuration de la requête
      console.error('Erreur:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
