const usersService = require('../services/users.service');

module.exports = (options = { verifyInDb: true }) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user || !user.id) return res.status(401).json({ error: 'Utilisateur non authentifié' });

    try {
      if (options.verifyInDb) {
        const isAdmin = await usersService.isAdmin(user.id);
        if (!isAdmin) return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      } else {
        if (user.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
      }

      next();
    } catch (err) {
      console.error('Erreur middleware roleAdminOnly:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
};