const prisma = require('../config/prisma');
const RegionEntity = require('../entities/region.entity');

exports.findAll = async () => {
  const rows = await prisma.regions.findMany();
  return rows.map((row) => new RegionEntity(row));
};

exports.upsertRegionByName = async (name, code) => {
  const row = await prisma.regions.upsert({
    where: { code },
    update: {},
    create: { code, name },
  });
  return new RegionEntity(row);
};
