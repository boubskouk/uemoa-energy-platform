import api from './api'

/**
 * Service pour gérer la recherche globale
 */
const searchService = {
  /**
   * Recherche globale dans tous les contenus
   * @param {String} query - Terme de recherche
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise}
   */
  async globalSearch(query, params = {}) {
    const response = await api.get('/search', {
      params: { q: query, ...params }
    })
    return response.data
  },

  /**
   * Recherche dans les acteurs uniquement
   * @param {String} query - Terme de recherche
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise}
   */
  async searchActors(query, params = {}) {
    const response = await api.get('/search/actors', {
      params: { q: query, ...params }
    })
    return response.data
  },

  /**
   * Recherche dans les actualités uniquement
   * @param {String} query - Terme de recherche
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise}
   */
  async searchNews(query, params = {}) {
    const response = await api.get('/search/news', {
      params: { q: query, ...params }
    })
    return response.data
  },

  /**
   * Recherche dans les événements uniquement
   * @param {String} query - Terme de recherche
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise}
   */
  async searchEvents(query, params = {}) {
    const response = await api.get('/search/events', {
      params: { q: query, ...params }
    })
    return response.data
  },

  /**
   * Obtenir des suggestions pour l'autocomplétion
   * @param {String} query - Début du terme de recherche
   * @param {Number} limit - Nombre de suggestions
   * @returns {Promise}
   */
  async getSuggestions(query, limit = 5) {
    const response = await api.get('/search/suggestions', {
      params: { q: query, limit }
    })
    return response.data
  },

  /**
   * Rechercher par tag
   * @param {String} tag - Tag à rechercher
   * @param {Object} params - Paramètres additionnels
   * @returns {Promise}
   */
  async searchByTag(tag, params = {}) {
    const response = await api.get('/search/tags', {
      params: { tag, ...params }
    })
    return response.data
  },

  /**
   * Récupérer les tags populaires
   * @param {Number} limit - Nombre de tags
   * @returns {Promise}
   */
  async getPopularTags(limit = 20) {
    const response = await api.get('/search/popular-tags', {
      params: { limit }
    })
    return response.data
  }
}

export default searchService
