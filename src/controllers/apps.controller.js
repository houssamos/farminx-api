const jwt = require('jsonwebtoken');
const appsService = require('../services/apps.service');

exports.loginApp = async (req, res) => {
  const { name, secret } = req.body;
  if (!name || !secret) return res.status(400).json({ error: "Nom et secret requis" });

  const app = await appsService.authenticate(name, secret);
  if (!app) return res.status(401).json({ error: "Identifiants invalides" });

  const token = jwt.sign({ role: 'app', appName: app.name, id: app.id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.json({ token });
};

exports.registerApp = async (req, res) => {
  const { name, secret } = req.body;
  if (!name || !secret) return res.status(400).json({ error: "Nom et secret requis" });

  try {
    const app = await appsService.registerApp({ name, secret });
    res.status(201).json({ id: app.id, name: app.name });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de l\'application:', err);
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'application" });
  }
};

exports.registerAppApiKey = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom requis' });

  try {
    const result = await appsService.createAppWithApiKey(name);
    res.status(201).json(result);
  } catch (err) {
    console.error('Erreur création app avec clé API:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
