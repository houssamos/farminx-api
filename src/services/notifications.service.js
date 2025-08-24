const path = require('path');
const notificationsRepository = require('../repositories/notifications.repository');
const { entityToModel } = require('../mapping/notification.mapping');
const usersRepository = require('../repositories/users.repository');
const emailService = require('./email.service');

const TEMPLATES = {
  stats: path.join(process.cwd(), 'src/templates/emails/statsTemplate.html'),
  marketplace: path.join(
    process.cwd(),
    'src/templates/emails/marketplaceTemplate.html',
  ),
};

exports.subscribe = async (userId, { stats = false, marketplace = false }) => {
  const entity = await notificationsRepository.upsert({ userId, stats, marketplace });
  return entityToModel(entity);
};

exports.getPreferences = async (userId) => {
  const entity = await notificationsRepository.findByUserId(userId);
  return entityToModel(entity);
};

exports.sendTemplatedEmail = async ({
  type,
  subject,
  variables = {},
  audience,
  emails = [],
}) => {
  const recipients = await resolveRecipients({ audience, emails });
  let sent = 0;
  let skipped = 0;
  const templatePath = TEMPLATES[type];

  for (const addr of recipients) {
    try {
      await emailService.sendHtmlNotification({
        to: addr,
        subject,
        templatePath,
        variables,
      });
      sent += 1;
    } catch (err) {
      console.error('Erreur envoi notification vers', addr, err);
      skipped += 1;
    }
  }

  return { sent, skipped };
};

async function resolveRecipients({ audience, emails }) {
  if (Array.isArray(emails) && emails.length) return emails;

  const search = {
    stats: audience === 'stats',
    marketplace: audience === 'marketplace',
  };

  const userIds = await notificationsRepository.findSubscribed(search);
  if (!userIds.length) return [];

  const users = await usersRepository.listByIds(userIds);
  return users.map((u) => u.email);
}
