import { createRouter, createWebHistory } from 'vue-router'

// Router configuration for UEMOA Energy Platform
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { title: 'Accueil' }
    },
    {
      path: '/actors',
      name: 'actors-list',
      component: () => import('../views/actors/ActorsList.vue'),
      meta: { title: 'Liste des Acteurs' }
    },
    {
      path: '/actors/:id',
      name: 'actor-detail',
      component: () => import('../views/actors/ActorDetail.vue'),
      meta: { title: 'Détail Acteur' }
    },
    // Routes News
    {
      path: '/news',
      name: 'news-list',
      component: () => import('../views/news/NewsList.vue'),
      meta: { title: 'Actualités' }
    },
    {
      path: '/news/:slug',
      name: 'news-detail',
      component: () => import('../views/news/NewsDetail.vue'),
      meta: { title: 'Détail Actualité' }
    },
    // Routes Events
    {
      path: '/events',
      name: 'events-list',
      component: () => import('../views/events/EventsList.vue'),
      meta: { title: 'Événements' }
    },
    {
      path: '/events/:slug',
      name: 'event-detail',
      component: () => import('../views/events/EventDetail.vue'),
      meta: { title: 'Détail Événement' }
    },
    // Route Search
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue'),
      meta: { title: 'Recherche' }
    },
    // Route Map
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/Map.vue'),
      meta: { title: 'Carte Interactive' }
    },
    // Route Statistics
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/Statistics.vue'),
      meta: { title: 'Statistiques' }
    },
    // Routes Admin
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../views/admin/Dashboard.vue'),
          meta: { title: 'Dashboard Admin' }
        },
        {
          path: 'news',
          name: 'admin-news',
          component: () => import('../views/admin/news/NewsList.vue'),
          meta: { title: 'Gestion des Actualités' }
        },
        {
          path: 'news/create',
          name: 'admin-news-create',
          component: () => import('../views/admin/news/NewsForm.vue'),
          meta: { title: 'Créer une Actualité' }
        },
        {
          path: 'news/edit/:id',
          name: 'admin-news-edit',
          component: () => import('../views/admin/news/NewsForm.vue'),
          meta: { title: 'Modifier une Actualité' }
        },
        {
          path: 'events',
          name: 'admin-events',
          component: () => import('../views/admin/events/EventsList.vue'),
          meta: { title: 'Gestion des Événements' }
        },
        {
          path: 'events/create',
          name: 'admin-events-create',
          component: () => import('../views/admin/events/EventForm.vue'),
          meta: { title: 'Créer un Événement' }
        },
        {
          path: 'events/edit/:id',
          name: 'admin-events-edit',
          component: () => import('../views/admin/events/EventForm.vue'),
          meta: { title: 'Modifier un Événement' }
        },
        {
          path: 'actors',
          name: 'admin-actors',
          component: () => import('../views/admin/actors/ActorsList.vue'),
          meta: { title: 'Gestion des Acteurs' }
        },
        {
          path: 'actors/create',
          name: 'admin-actors-create',
          component: () => import('../views/admin/actors/ActorForm.vue'),
          meta: { title: 'Créer un Acteur' }
        },
        {
          path: 'actors/edit/:id',
          name: 'admin-actors-edit',
          component: () => import('../views/admin/actors/ActorForm.vue'),
          meta: { title: 'Modifier un Acteur' }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/users/UsersList.vue'),
          meta: { title: 'Gestion des Utilisateurs' }
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('../views/admin/Settings.vue'),
          meta: { title: 'Paramètres' }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
      meta: { title: 'Connexion', guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
      meta: { title: 'Inscription', guest: true }
    },
    {
      path: '/test-login',
      name: 'test-login',
      component: () => import('../views/auth/LoginTest.vue'),
      meta: { title: 'Test Login' }
    },
    {
      path: '/login-debug',
      name: 'login-debug',
      component: () => import('../views/auth/LoginDebug.vue'),
      meta: { title: 'Login Debug' }
    },
    // Route 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { title: 'Page non trouvée' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Mettre à jour le titre de la page
  document.title = `${to.meta.title || 'UEMOA Energy Platform'} - UEMOA Energy Platform`

  // Vérifier l'authentification
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const isAuthenticated = !!(token && user)
  const isAdmin = user ? JSON.parse(user).role === 'admin' : false

  // Routes qui nécessitent une authentification
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion
    next({
      name: 'login',
      query: { redirect: to.fullPath } // Sauvegarder la destination pour redirection après connexion
    })
    return
  }

  // Routes qui nécessitent un rôle admin
  if (to.meta.requiresAdmin && !isAdmin) {
    // Rediriger vers l'accueil si l'utilisateur n'est pas admin
    next({ name: 'home' })
    return
  }

  // Routes réservées aux visiteurs (login/register)
  if (to.meta.guest && isAuthenticated) {
    // Rediriger vers l'admin si déjà connecté en tant qu'admin
    if (isAdmin) {
      next({ name: 'admin-dashboard' })
    } else {
      next({ name: 'home' })
    }
    return
  }

  next()
})

export default router
