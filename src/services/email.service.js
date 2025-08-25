const fs = require('fs/promises');
const path = require('path');
const { sendMail } = require('../utils/mailer');

exports.sendPasswordResetEmail = async (email, token) => {
  const link = `https://example.com/reset-password?token=${token}`;
  await exports.sendHtmlNotification({
    to: email,
    subject: 'Réinitialisation de mot de passe',
    templatePath: path.join(__dirname, '../templates/emails/passwordResetTemplate.html'),
    variables: { name: email, link },
  });
};

exports.sendVerificationEmail = async (email, token) => {
  const link = `https://example.com/verify-email?token=${token}`;
  await exports.sendHtmlNotification({
    to: email,
    subject: 'Vérification de votre adresse email',
    templatePath: path.join(__dirname, '../templates/emails/emailVerificationTemplate.html'),
    variables: { name: email, link },
  });
};

exports.sendHtmlNotification = async ({ to, subject, templatePath, variables }) => {
  const template = await fs.readFile(templatePath, 'utf8');
  const html = template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => variables[key] ?? '');
  await sendMail({ to, subject, html });
};
