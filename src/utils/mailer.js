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

module.exports = { sendMail };
