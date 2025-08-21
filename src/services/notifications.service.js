const path = require('path');
const { sendTemplatedEmail } = require('../utils/mailer');

const templates = {
  stats: {
    subject: 'Farm statistics',
    path: path.join(__dirname, '../templates/emails/statsTemplate.html'),
  },
  alert: {
    subject: 'Alert',
    path: path.join(__dirname, '../templates/emails/alertTemplate.html'),
  },
  welcome: {
    subject: 'Welcome',
    path: path.join(__dirname, '../templates/emails/welcomeTemplate.html'),
  },
};

function resolveRecipients(to) {
  const recipients = Array.isArray(to) ? to : [to];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const unique = new Set();

  for (const email of recipients) {
    const trimmed = typeof email === 'string' ? email.trim() : '';
    if (!emailRegex.test(trimmed)) {
      throw new Error(`Invalid email address: ${email}`);
    }
    unique.add(trimmed);
  }

  return Array.from(unique);
}

async function sendNotification(type, to, data) {
  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown notification type: ${type}`);
  }
  const recipients = resolveRecipients(to);
  return sendTemplatedEmail(recipients, template.subject, template.path, data);
}

module.exports = { sendNotification };
