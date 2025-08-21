const fs = require('fs/promises');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

const templateCache = new Map();

async function loadTemplate(templatePath) {
  if (!templateCache.has(templatePath)) {
    const source = await fs.readFile(templatePath, 'utf8');
    const compiled = handlebars.compile(source);
    templateCache.set(templatePath, compiled);
  }
  return templateCache.get(templatePath);
}

async function sendMail(to, subject, templatePath, data = {}) {
  const template = await loadTemplate(templatePath);
  const html = template(data);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

/**
 * Send a templated email to multiple recipients with limited concurrency.
 *
 * @param {string[]} recipients - List of email addresses to send to.
 * @param {string} subject - Email subject.
 * @param {string} templatePath - Path to the handlebars template.
 * @param {Object} [data={}] - Data for the template.
 * @param {number} [batchSize=5] - Number of concurrent emails to send.
 * @returns {Promise<{sent: number, skipped: number}>}
 */
async function sendTemplatedEmail(
  recipients,
  subject,
  templatePath,
  data = {},
  batchSize = 5
) {
  const template = await loadTemplate(templatePath);
  const html = template(data);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  let sent = 0;
  let skipped = 0;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (to) => {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html,
          });
          return true;
        } catch (err) {
          return false;
        }
      })
    );

    for (const result of results) {
      if (result) {
        sent += 1;
      } else {
        skipped += 1;
      }
    }
  }

  return { sent, skipped };
}

module.exports = { sendMail, sendTemplatedEmail };
