import { defineStore } from 'pinia'
import eventsService from '../services/events.service'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
    currentEvent: null,
    featuredEvents: [],
    upcomingEvents: [],
    ongoingEvents: [],
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
      locationType: null,
      upcoming: null,
      search: ''
    }
  }),

  getters: {
    /**
     * Obtenir les événements filtrés
     */
    filteredEvents: (state) => {
      let filtered = state.events

      if (state.filters.category) {
        filtered = filtered.filter(e => e.category === state.filters.category)
      }

      if (state.filters.country) {
        filtered = filtered.filter(e =>
          e.location?.country?._id === state.filters.country
        )
      }

      if (state.filters.locationType) {
        filtered = filtered.filter(e => e.location?.type === state.filters.locationType)
      }

      if (state.filters.upcoming === true) {
        const now = new Date()
        filtered = filtered.filter(e => new Date(e.startDate) >= now)
      }

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(e =>
          e.title.fr.toLowerCase().includes(search) ||
          e.title.en?.toLowerCase().includes(search) ||
          e.description?.fr?.toLowerCase().includes(search)
        )
      }

      return filtered
    },

    /**
     * Vérifier si des événements sont chargés
     */
    hasEvents: (state) => state.events.length > 0
  },

  actions: {
    /**
     * Charger tous les événements avec filtres
     */
    async fetchEvents(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await eventsService.getAll({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters,
          ...params
        })

        this.events = response.data
        this.pagination.total = response.total
        this.pagination.pages = response.pages
        this.pagination.page = response.page

        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des événements'
        console.error('Erreur fetchEvents:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Charger un événement par ID ou slug
     */
    async fetchEventById(identifier) {
      this.loading = true
      this.error = null

      try {
        const response = await eventsService.getByIdentifier(identifier)
        this.currentEvent = response.data

        // Incrémenter les vues
        await eventsService.incrementViews(response.data._id)

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Événement non trouvé'
        console.error('Erreur fetchEventById:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Charger les événements à venir
     */
    async fetchUpcomingEvents(limit = 10) {
      try {
        const response = await eventsService.getUpcoming(limit)
        this.upcomingEvents = response.data
        return response.data
      } catch (error) {
        console.error('Erreur fetchUpcomingEvents:', error)
        throw error
      }
    },

    /**
     * Charger les événements en vedette
     */
    async fetchFeaturedEvents(limit = 5) {
      try {
        const response = await eventsService.getFeatured(limit)
        this.featuredEvents = response.data
        return response.data
      } catch (error) {
        console.error('Erreur fetchFeaturedEvents:', error)
        throw error
      }
    },

    /**
     * Charger les événements en cours
     */
    async fetchOngoingEvents() {
      try {
        const response = await eventsService.getOngoing()
        this.ongoingEvents = response.data
        return response.data
      } catch (error) {
        console.error('Erreur fetchOngoingEvents:', error)
        throw error
      }
    },

    /**
     * Charger les événements par pays
     */
    async fetchEventsByCountry(countryId, params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await eventsService.getByCountry(countryId, params)
        this.events = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Créer un nouvel événement (Admin)
     */
    async createEvent(eventData) {
      this.loading = true
      this.error = null

      try {
        const response = await eventsService.create(eventData)
        this.events.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Mettre à jour un événement (Admin)
     */
    async updateEvent(id, eventData) {
      this.loading = true
      this.error = null

      try {
        const response = await eventsService.update(id, eventData)
        const index = this.events.findIndex(e => e._id === id)
        if (index !== -1) {
          this.events[index] = response.data
        }
        if (this.currentEvent?._id === id) {
          this.currentEvent = response.data
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
     * Supprimer un événement (Admin)
     */
    async deleteEvent(id) {
      this.loading = true
      this.error = null

      try {
        await eventsService.delete(id)
        this.events = this.events.filter(e => e._id !== id)
        if (this.currentEvent?._id === id) {
          this.currentEvent = null
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Annuler un événement (Admin)
     */
    async cancelEvent(id) {
      try {
        const response = await eventsService.cancel(id)
        const index = this.events.findIndex(e => e._id === id)
        if (index !== -1) {
          this.events[index] = response.data
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
        const response = await eventsService.toggleFeature(id)
        const index = this.events.findIndex(e => e._id === id)
        if (index !== -1) {
          this.events[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      }
    },

    /**
     * Marquer son intérêt pour un événement
     */
    async markInterested(id) {
      try {
        const response = await eventsService.markInterested(id)
        const index = this.events.findIndex(e => e._id === id)
        if (index !== -1) {
          this.events[index].interestedCount = response.interestedCount
        }
        if (this.currentEvent?._id === id) {
          this.currentEvent.interestedCount = response.interestedCount
        }
        return response
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
        locationType: null,
        upcoming: null,
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
      this.events = []
      this.currentEvent = null
      this.featuredEvents = []
      this.upcomingEvents = []
      this.ongoingEvents = []
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
