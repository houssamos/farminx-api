const prisma = require('../config/prisma');
exports.upsertProduct = async ({ name, category, unit }) => {
    return await prisma.products.upsert({
      where: { name },
      update: {},
      create: { name, category, unit }
    });
  };