const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.upsertProduct = async ({ name, category, unit }) => {
    return await prisma.products.upsert({
      where: { name },
      update: {},
      create: { name, category, unit }
    });
  };