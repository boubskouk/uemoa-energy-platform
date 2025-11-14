/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param {Array} allowedRoles - Tableau des rôles autorisés
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise.'
      });
    }

    // Vérifier que le rôle de l'utilisateur est dans les rôles autorisés
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Permissions insuffisantes.',
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est admin
 */
const isAdmin = checkRole(['admin']);

/**
 * Middleware pour vérifier que l'utilisateur est admin ou acteur
 */
const isAdminOrActor = checkRole(['admin', 'actor']);

/**
 * Middleware pour vérifier la propriété d'une ressource
 * L'utilisateur doit être soit admin, soit le créateur de la ressource
 */
const isOwnerOrAdmin = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise.'
        });
      }

      // Admin a toujours accès
      if (req.user.role === 'admin') {
        return next();
      }

      // Récupérer l'ID de la ressource
      const resourceId = req.params[resourceIdParam];

      // Récupérer la ressource
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée.'
        });
      }

      // Vérifier la propriété
      const ownerId = resource.createdBy || resource.author || resource.user;

      if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé. Vous n\'êtes pas le propriétaire de cette ressource.'
        });
      }

      // Attacher la ressource à la requête pour éviter une nouvelle requête
      req.resource = resource;
      next();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des permissions.',
        error: error.message
      });
    }
  };
};

module.exports = {
  checkRole,
  isAdmin,
  isAdminOrActor,
  isOwnerOrAdmin
};
