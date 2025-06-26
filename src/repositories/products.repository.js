const prisma = require('../config/prisma');
const CultureEntity = require('../entities/culture.entity');
exports.upsertCulture = async ({ name, category, unit, code }) => {
  const row = await prisma.products.upsert({
    where: { name },
    update: {},
    create: { name, category, unit, code },
  });
  return new CultureEntity(row);
};
