import api from './api'

const categoriesService = {
  /**
   * Récupérer toutes les catégories
   */
  getAll() {
    return api.get('/categories')
  },

  /**
   * Récupérer une catégorie par ID
   */
  getById(id) {
    return api.get(`/categories/${id}`)
  }
}

export default categoriesService
