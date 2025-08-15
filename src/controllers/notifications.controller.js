const notificationsService = require('../services/notifications.service');
const emailService = require('../services/email.service');

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

exports.adminSend = async (req, res) => {
  try {
    const { subject, body } = req.body || {};
    const { stats, marketplace } = req.query || {};
    const emails = await emailService.getSubscribedEmails({
      stats: stats === 'true',
      marketplace: marketplace === 'true'
    });
    const result = await emailService.sendBulkEmail(emails, subject, body);
    res.json(result);
  } catch (err) {
    console.error('Erreur envoi notifications admin:', err);
    res.status(500).json({ error: "Erreur lors de l'envoi des notifications" });
  }
};
