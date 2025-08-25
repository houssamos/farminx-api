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
  if (!templatePath) throw new Error('Template inconnu');

  for (const recipient of recipients) {
    const nameParts = [];
    if (recipient.first_name) nameParts.push(recipient.first_name);
    if (recipient.last_name) nameParts.push(recipient.last_name);
    const name =
      nameParts.join(' ').trim() || recipient.name || recipient.email.split('@')[0];
    const vars = { ...variables, name };
    try {
      await emailService.sendHtmlNotification({
        to: recipient.email,
        subject,
        templatePath,
        variables: vars,
      });
      sent += 1;
    } catch (err) {
      console.error('Erreur envoi notification vers', recipient.email, err);
      skipped += 1;
    }
  }

  return { sent, skipped };
};

async function resolveRecipients({ audience, emails }) {
  if (Array.isArray(emails) && emails.length) {
    return emails.map((e) =>
      typeof e === 'string'
        ? { email: e }
        : e,
    );
  }

  const search = {
    stats: audience === 'stats',
    marketplace: audience === 'marketplace',
  };

  const userIds = await notificationsRepository.findSubscribed(search);
  if (!userIds.length) return [];

  const users = await usersRepository.listByIds(userIds);
  return users;
}
