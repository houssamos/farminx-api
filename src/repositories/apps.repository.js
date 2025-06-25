const prisma = require('../config/prisma');

exports.findByName = async (name) => {
  return await prisma.api_app.findUnique({ where: { name } });
};

exports.registerApp = async ({ name, secret }) => {
  return await prisma.api_app.create({ data: { name, secret } });
};

exports.findByApiKey = async (apiKey) => {
  return await prisma.api_app.findUnique({ where: { apiKey } });
};

exports.registerAppWithApiKey = async ({ name, apiKey }) => {
  return await prisma.api_app.create({ data: { name, apiKey } });
};
