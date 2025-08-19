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
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

exports.sendBulkEmail = async (addresses, subject, text, html = text) => {
  const result = { sent: [], failed: [] };
  for (const addr of addresses) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: addr,
        subject,
        text,
        html,
      });
      result.sent.push(addr);
    } catch (err) {
      console.error('Erreur envoi email vers', addr, err);
      result.failed.push(addr);
    }
  }
  return result;
};

exports.sendPasswordResetEmail = async (email, token) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Réinitialisation de mot de passe',
    text: `Utilisez ce jeton pour réinitialiser votre mot de passe : ${token}`,
  });
};

exports.sendVerificationEmail = async (email, token) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Vérification de votre adresse email',
    text: `Veuillez vérifier votre email avec ce jeton : ${token}`,
  });
};

/**
 * Build the subject, plain text and HTML body for the email sent when new
 * statistics are available.
 *
 * @param {string} statsUrl URL to the statistics page
 * @param {string[]} cultures List of culture names
 * @param {number|string} year Year of the statistics
 * @returns {{subject: string, text: string, html: string}}
 */
exports.buildStatsAvailableEmail = (statsUrl, cultures, year) => {
  const cultureList = Array.isArray(cultures) ? cultures.join(', ') : cultures;
  const subject = 'Nouvelles statistiques disponibles';
  const text = `Les statistiques pour ${cultureList} ${year} sont disponibles : ${statsUrl}`;
  const html = `
    <h1>Statistiques disponibles</h1>
    <p>Les statistiques pour ${cultureList} ${year} sont maintenant disponibles.</p>
    <p><a href="${statsUrl}">${statsUrl}</a></p>
  `;
  return { subject, text, html };
};
