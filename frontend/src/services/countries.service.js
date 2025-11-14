import api from './api'

const countriesService = {
  /**
   * Récupérer tous les pays UEMOA
   */
  getAll() {
    return api.get('/countries')
  },

  /**
   * Récupérer un pays par ID
   */
  getById(id) {
    return api.get(`/countries/${id}`)
  },

  /**
   * Récupérer les acteurs d'un pays
   */
  getActors(id) {
    return api.get(`/countries/${id}/actors`)
  }
}

export default countriesService
