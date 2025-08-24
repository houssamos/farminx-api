const fs = require('fs');
const handlebars = require('handlebars');
const { transporter } = require('../services/email.service');

/**
 * Sends an HTML email based on a Handlebars template.
 *
 * @param {Object} options
 * @param {string} options.to Recipient email address
 * @param {string} options.subject Email subject
 * @param {string} options.templatePath Path to the Handlebars template file
 * @param {Object} [options.variables={}] Variables to interpolate in the template
 */
async function sendHtmlNotification({ to, subject, templatePath, variables = {} }) {
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  const html = template(variables);

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    html,
  });
}

module.exports = { sendHtmlNotification };
