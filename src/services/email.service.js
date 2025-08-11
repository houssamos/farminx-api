const nodemailer = require('nodemailer');
const notificationsRepository = require('../repositories/notifications.repository');
const usersRepository = require('../repositories/users.repository');

exports.getSubscribedEmails = async ({ stats = false, marketplace = false }) => {
  const userIds = await notificationsRepository.findSubscribed({ stats, marketplace });
  if (!userIds.length) return [];
  const users = await usersRepository.listByIds(userIds);
  return users.map((u) => u.email);
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: process.env.EMAIL_USER
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
});

exports.sendBulkEmail = async (addresses, subject, body) => {
  const result = { sent: [], failed: [] };
  for (const addr of addresses) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: addr,
        subject,
        text: body,
      });
      result.sent.push(addr);
    } catch (err) {
      console.error('Erreur envoi email vers', addr, err);
      result.failed.push(addr);
    }
  }
  return result;
};
