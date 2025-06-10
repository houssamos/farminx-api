const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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