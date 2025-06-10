const prisma = require('../config/prisma');

exports.findAll = async () => {
    return await prisma.regions.findMany();
};

exports.upsertRegionByName = async (name, code) => {
    return await prisma.regions.upsert({
      where: { code },
      update: {},
      create: { code, name }
    });
  };