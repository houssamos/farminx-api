const notificationsService = require('../services/notifications.service');

exports.subscribe = async (req, res) => {
  try {
    const { stats = false, marketplace = false } = req.body || {};
    const preferences = await notificationsService.subscribe(req.user.id, { stats, marketplace });
    res.json(preferences);
  } catch (err) {
    console.error('Erreur subscribe notifications:', err);
    res.status(500).json({ error: "Erreur lors de la mise à jour des préférences de notification" });
  }
};

exports.get = async (req, res) => {
  try {
    const preferences = await notificationsService.getPreferences(req.user.id);
    res.json(preferences);
  } catch (err) {
    console.error('Erreur get notifications:', err);
    res.status(500).json({ error: "Erreur lors de la récupération des préférences de notification" });
  }
};

exports.send = async (req, res) => {
  try {
    const { type, subject, variables, audience, emails } = req.body || {};
    if (!type || !subject) return res.status(400).json({ error: 'Type et sujet requis' });

    if (type === 'stats') {
      if (!variables.product || !variables.year || !variables.link) {
        return res.status(400).json({ error: 'Produit, année et lien requis' });
      }
    } else if (type === 'marketplace') {
      if (!variables.link) return res.status(400).json({ error: 'Lien requis' });
    } else {
      return res.status(400).json({ error: 'Type invalide' });
    }

    const { sent, skipped } = await notificationsService.sendTemplatedEmail({
      type,
      subject,
      variables: {...variables},
      audience,
      emails,
    });
    res.json({ sent, skipped });
  } catch (err) {
    console.error('Erreur envoi notifications:', err);
    res.status(500).json({ error: "Erreur lors de l'envoi des notifications" });
  }
};

