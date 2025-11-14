import api from './api'

/**
 * Service pour gérer les actualités (News)
 */
const newsService = {
  /**
   * Récupérer toutes les actualités avec filtres
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise}
   */
  async getAll(params = {}) {
    const response = await api.get('/news', { params })
    return response.data
  },

  /**
   * Récupérer une actualité par ID ou slug
   * @param {String} identifier - ID ou slug
   * @returns {Promise}
   */
  async getByIdentifier(identifier) {
    const response = await api.get(`/news/${identifier}`)
    return response.data
  },

  /**
   * Récupérer les actualités à la une
   * @param {Number} limit - Nombre d'actualités
   * @returns {Promise}
   */
  async getFeatured(limit = 5) {
    const response = await api.get('/news/featured', { params: { limit } })
    return response.data
  },

  /**
   * Récupérer les statistiques des actualités (Admin)
   * @returns {Promise}
   */
  async getStats() {
    const response = await api.get('/news/stats')
    return response.data
  },

  /**
   * Créer une nouvelle actualité (Admin)
   * @param {Object} newsData - Données de l'actualité
   * @returns {Promise}
   */
  async create(newsData) {
    const response = await api.post('/news', newsData)
    return response.data
  },

  /**
   * Mettre à jour une actualité (Admin)
   * @param {String} id - ID de l'actualité
   * @param {Object} newsData - Données à mettre à jour
   * @returns {Promise}
   */
  async update(id, newsData) {
    const response = await api.put(`/news/${id}`, newsData)
    return response.data
  },

  /**
   * Supprimer une actualité (Admin)
   * @param {String} id - ID de l'actualité
   * @returns {Promise}
   */
  async delete(id) {
    const response = await api.delete(`/news/${id}`)
    return response.data
  },

  /**
   * Publier une actualité (Admin)
   * @param {String} id - ID de l'actualité
   * @returns {Promise}
   */
  async publish(id) {
    const response = await api.put(`/news/${id}/publish`)
    return response.data
  },

  /**
   * Dépublier une actualité (Admin)
   * @param {String} id - ID de l'actualité
   * @returns {Promise}
   */
  async unpublish(id) {
    const response = await api.put(`/news/${id}/unpublish`)
    return response.data
  },

  /**
   * Toggle mise en vedette (Admin)
   * @param {String} id - ID de l'actualité
   * @returns {Promise}
   */
  async toggleFeature(id) {
    const response = await api.put(`/news/${id}/feature`)
    return response.data
  },

  /**
   * Incrémenter le compteur de vues
   * @param {String} id - ID de l'actualité
   * @returns {Promise}
   */
  async incrementViews(id) {
    const response = await api.post(`/news/${id}/view`)
    return response.data
  }
}

export default newsService
