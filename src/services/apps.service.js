const appsRepository = require('../repositories/apps.repository');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

exports.authenticate = async (name, secret) => {
    const app = await appsRepository.findByName(name);
    if (!app) return null;
    const isValid = await bcrypt.compare(secret, app.secret);
    return isValid ? app : null;
  };
  
exports.registerApp = async ({ name, secret }) => {
    const hashedSecret = await bcrypt.hash(secret, 15);
    return await appsRepository.registerApp({ name, secret: hashedSecret });
  };

exports.createAppWithApiKey = async (name) => {
  const apiKey = nanoid(128); // Generate a random API key
  const app = await appsRepository.registerAppWithApiKey({ name, apiKey });
  return { id: app.id, name: app.name, apiKey: app.apiKey };
};

exports.verifyApiKey = async (key) => {
  return await appsRepository.findByApiKey(key);
};