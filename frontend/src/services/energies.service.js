import api from './api'

const energiesService = {
  /**
   * Récupérer tous les types d'énergies
   */
  getAll() {
    return api.get('/energies')
  },

  /**
   * Récupérer un type d'énergie par ID
   */
  getById(id) {
    return api.get(`/energies/${id}`)
  }
}

export default energiesService
