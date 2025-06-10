const prisma = require('../config/prisma');
exports.upsertProduct = async ({ name, category, unit, code }) => {
    return await prisma.products.upsert({
      where: { name },
      update: {},
      create: { name, category, unit, code }
    });
  };