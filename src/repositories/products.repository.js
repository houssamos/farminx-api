const prisma = require('../config/prisma');
const ProductEntity = require('../entities/product.entity');
exports.upsertProduct = async ({ name, category, unit, code }) => {
  const row = await prisma.products.upsert({
    where: { name },
    update: {},
    create: { name, category, unit, code },
  });
  return new ProductEntity(row);
};
