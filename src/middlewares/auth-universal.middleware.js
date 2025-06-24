const jwt = require('jsonwebtoken');
const appsService = require('../services/apps.service');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  // 🔐 API Key
  if (apiKey) {
    try {
      const validApp = await appsService.verifyApiKey(apiKey);
      if (!validApp) return res.status(403).json({ error: 'Clé API invalide' });
      req.app = { name: validApp.name, role: 'app', id: validApp.id };
      return next();
    } catch (err) {
      console.error("Erreur lors de la vérification de la clé API:", err);
      return res.status(500).json({ error: 'Erreur serveur (API Key)' });
    }
  }

  // 🔐 JWT Token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (payload.role === 'user' || payload.role === 'admin') {
        req.user = payload;
      } else if (payload.role === 'app') {
        req.app = payload;
      } else {
        return res.status(403).json({ error: 'Rôle non autorisé' });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token invalide' });
    }
  }

  return res.status(401).json({ error: 'Aucune authentification valide fournie' });
};
