import { defineStore } from 'pinia'
import newsService from '../services/news.service'

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [],
    currentNews: null,
    featuredNews: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    },
    filters: {
      category: null,
      country: null,
      featured: null,
      search: ''
    }
  }),

  getters: {
    /**
     * Obtenir les actualités filtrées
     */
    filteredNews: (state) => {
      let filtered = state.news

      if (state.filters.category) {
        filtered = filtered.filter(n => n.category === state.filters.category)
      }

      if (state.filters.country) {
        filtered = filtered.filter(n =>
          n.relatedCountries?.some(c => c._id === state.filters.country)
        )
      }

      if (state.filters.featured !== null) {
        filtered = filtered.filter(n => n.featured === state.filters.featured)
      }

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(n =>
          n.title.fr.toLowerCase().includes(search) ||
          n.title.en?.toLowerCase().includes(search) ||
          n.excerpt?.fr?.toLowerCase().includes(search)
        )
      }

      return filtered
    },

    /**
     * Vérifier si des actualités sont chargées
     */
    hasNews: (state) => state.news.length > 0
  },

  actions: {
    /**
     * Charger toutes les actualités avec filtres
     */
    async fetchNews(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await newsService.getAll({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters,
          ...params
        })

        this.news = response.data
        this.pagination.total = response.total
        this.pagination.pages = response.pages
        this.pagination.page = response.page

        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des actualités'
        console.error('Erreur fetchNews:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Charger une actualité par ID ou slug
     */
    async fetchNewsById(identifier) {
      this.loading = true
      this.error = null

      try {
        const response = await newsService.getByIdentifier(identifier)
        this.currentNews = response.data

        // Incrémenter les vues
        await newsService.incrementViews(response.data._id)

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Actualité non trouvée'
        console.error('Erreur fetchNewsById:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Charger les actualités à la une
     */
    async fetchFeaturedNews(limit = 5) {
      try {
        const response = await newsService.getFeatured(limit)
        this.featuredNews = response.data
        return response.data
      } catch (error) {
        console.error('Erreur fetchFeaturedNews:', error)
        throw error
      }
    },

    /**
     * Créer une nouvelle actualité (Admin)
     */
    async createNews(newsData) {
      this.loading = true
      this.error = null

      try {
        const response = await newsService.create(newsData)
        this.news.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Mettre à jour une actualité (Admin)
     */
    async updateNews(id, newsData) {
      this.loading = true
      this.error = null

      try {
        const response = await newsService.update(id, newsData)
        const index = this.news.findIndex(n => n._id === id)
        if (index !== -1) {
          this.news[index] = response.data
        }
        if (this.currentNews?._id === id) {
          this.currentNews = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Supprimer une actualité (Admin)
     */
    async deleteNews(id) {
      this.loading = true
      this.error = null

      try {
        await newsService.delete(id)
        this.news = this.news.filter(n => n._id !== id)
        if (this.currentNews?._id === id) {
          this.currentNews = null
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Publier une actualité (Admin)
     */
    async publishNews(id) {
      try {
        const response = await newsService.publish(id)
        const index = this.news.findIndex(n => n._id === id)
        if (index !== -1) {
          this.news[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    /**
     * Toggle mise en vedette (Admin)
     */
    async toggleFeature(id) {
      try {
        const response = await newsService.toggleFeature(id)
        const index = this.news.findIndex(n => n._id === id)
        if (index !== -1) {
          this.news[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    /**
     * Mettre à jour les filtres
     */
    updateFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * Réinitialiser les filtres
     */
    resetFilters() {
      this.filters = {
        category: null,
        country: null,
        featured: null,
        search: ''
      }
    },

    /**
     * Changer de page
     */
    setPage(page) {
      this.pagination.page = page
    },

    /**
     * Réinitialiser le store
     */
    reset() {
      this.news = []
      this.currentNews = null
      this.featuredNews = []
      this.loading = false
      this.error = null
      this.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
      }
      this.resetFilters()
    }
  }
})
