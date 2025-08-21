const { sendNotification } = require('../services/notifications.service');

async function notify(req, res) {
  const { type, subject, audience, emails = [], data } = req.body || {};

  if (!type) {
    return res.status(400).json({ error: 'type is required' });
  }

  if (!subject) {
    return res.status(400).json({ error: 'subject is required' });
  }

  if (!audience && (!Array.isArray(emails) || emails.length === 0)) {
    return res
      .status(400)
      .json({ error: 'Either audience or a non-empty emails array must be provided' });
  }

  try {
    const recipients = audience || emails;
    await sendNotification(type, recipients, data);
    return res.status(200).json({ message: 'Notification sent' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { notify };
