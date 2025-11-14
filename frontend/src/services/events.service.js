import api from './api'

/**
 * Service pour gérer les événements (Events)
 */
const eventsService = {
  /**
   * Récupérer tous les événements avec filtres
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise}
   */
  async getAll(params = {}) {
    const response = await api.get('/events', { params })
    return response.data
  },

  /**
   * Récupérer un événement par ID ou slug
   * @param {String} identifier - ID ou slug
   * @returns {Promise}
   */
  async getByIdentifier(identifier) {
    const response = await api.get(`/events/${identifier}`)
    return response.data
  },

  /**
   * Récupérer les événements à venir
   * @param {Number} limit - Nombre d'événements
   * @returns {Promise}
   */
  async getUpcoming(limit = 10) {
    const response = await api.get('/events/upcoming', { params: { limit } })
    return response.data
  },

  /**
   * Récupérer les événements en vedette
   * @param {Number} limit - Nombre d'événements
   * @returns {Promise}
   */
  async getFeatured(limit = 5) {
    const response = await api.get('/events/featured', { params: { limit } })
    return response.data
  },

  /**
   * Récupérer les événements en cours
   * @returns {Promise}
   */
  async getOngoing() {
    const response = await api.get('/events/ongoing')
    return response.data
  },

  /**
   * Récupérer les événements par pays
   * @param {String} countryId - ID du pays
   * @param {Object} params - Paramètres additionnels
   * @returns {Promise}
   */
  async getByCountry(countryId, params = {}) {
    const response = await api.get(`/events/country/${countryId}`, { params })
    return response.data
  },

  /**
   * Récupérer les événements à proximité
   * @param {Number} longitude - Longitude
   * @param {Number} latitude - Latitude
   * @param {Number} maxDistance - Distance maximale en mètres
   * @param {Number} limit - Nombre d'événements
   * @returns {Promise}
   */
  async getNearby(longitude, latitude, maxDistance = 50000, limit = 20) {
    const response = await api.get('/events/nearby', {
      params: { longitude, latitude, maxDistance, limit }
    })
    return response.data
  },

  /**
   * Récupérer les statistiques des événements (Admin)
   * @returns {Promise}
   */
  async getStats() {
    const response = await api.get('/events/stats')
    return response.data
  },

  /**
   * Créer un nouvel événement (Admin)
   * @param {Object} eventData - Données de l'événement
   * @returns {Promise}
   */
  async create(eventData) {
    const response = await api.post('/events', eventData)
    return response.data
  },

  /**
   * Mettre à jour un événement (Admin)
   * @param {String} id - ID de l'événement
   * @param {Object} eventData - Données à mettre à jour
   * @returns {Promise}
   */
  async update(id, eventData) {
    const response = await api.put(`/events/${id}`, eventData)
    return response.data
  },

  /**
   * Supprimer un événement (Admin)
   * @param {String} id - ID de l'événement
   * @returns {Promise}
   */
  async delete(id) {
    const response = await api.delete(`/events/${id}`)
    return response.data
  },

  /**
   * Annuler un événement (Admin)
   * @param {String} id - ID de l'événement
   * @returns {Promise}
   */
  async cancel(id) {
    const response = await api.put(`/events/${id}/cancel`)
    return response.data
  },

  /**
   * Toggle mise en vedette (Admin)
   * @param {String} id - ID de l'événement
   * @returns {Promise}
   */
  async toggleFeature(id) {
    const response = await api.put(`/events/${id}/feature`)
    return response.data
  },

  /**
   * Incrémenter le compteur de vues
   * @param {String} id - ID de l'événement
   * @returns {Promise}
   */
  async incrementViews(id) {
    const response = await api.post(`/events/${id}/view`)
    return response.data
  },

  /**
   * Marquer son intérêt pour un événement
   * @param {String} id - ID de l'événement
   * @returns {Promise}
   */
  async markInterested(id) {
    const response = await api.post(`/events/${id}/interested`)
    return response.data
  }
}

export default eventsService
