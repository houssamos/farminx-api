const path = require('path');
const { sendMail } = require('../utils/mailer');

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

async function sendNotification(type, to, data) {
  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown notification type: ${type}`);
  }
  await sendMail(to, template.subject, template.path, data);
}

module.exports = { sendNotification };
