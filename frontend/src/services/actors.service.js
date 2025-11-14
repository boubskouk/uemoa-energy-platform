import api from './api'

const actorsService = {
  /**
   * Récupérer tous les acteurs avec filtres
   */
  getAll(params = {}) {
    return api.get('/actors', { params })
  },

  /**
   * Récupérer un acteur par ID
   */
  getById(id) {
    return api.get(`/actors/${id}`)
  },

  /**
   * Créer un nouvel acteur
   */
  create(data) {
    return api.post('/actors', data)
  },

  /**
   * Mettre à jour un acteur
   */
  update(id, data) {
    return api.put(`/actors/${id}`, data)
  },

  /**
   * Supprimer un acteur
   */
  delete(id) {
    return api.delete(`/actors/${id}`)
  },

  /**
   * Récupérer mon profil acteur
   */
  getMyActor() {
    return api.get('/actors/me')
  },

  /**
   * Récupérer les acteurs en attente (admin)
   */
  getPending() {
    return api.get('/actors/pending')
  },

  /**
   * Approuver un acteur (admin)
   */
  approve(id) {
    return api.patch(`/actors/${id}/approve`)
  },

  /**
   * Rejeter un acteur (admin)
   */
  reject(id, reason) {
    return api.patch(`/actors/${id}/reject`, { reason })
  },

  /**
   * Mettre en vedette un acteur (admin)
   */
  toggleFeature(id) {
    return api.patch(`/actors/${id}/feature`)
  }
}

export default actorsService
