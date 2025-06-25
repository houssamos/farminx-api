const prisma = require('../config/prisma');
const ProductEntity = require('../entities/product.entity');

exports.findAll = async () => {
  const rows = await prisma.products.findMany();
  return rows.map((row) => new ProductEntity(row));
};

exports.findYears = async () => {
    const years = await prisma.agricultural_stats.findMany({
        distinct: ['year'],
        select: { year: true },
        orderBy: { year: 'asc' }
    });
    return years.map(y => y.year);
};