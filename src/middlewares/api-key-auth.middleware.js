module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.APP_API_KEY) {
      return res.status(403).json({ error: 'Clé API invalide ou manquante' });
    }
    next();
  };