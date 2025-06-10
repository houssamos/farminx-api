// src/repositories/stats.repository.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.upsertStat = async ({ regionId, productId, year, surface, rendement, production }) => {
  const existing = await prisma.agricultural_stats.findFirst({
    where: {
      region_id: regionId,
      product_id: productId,
      year: year,
      granularity: 'region'
    }
  });

  const data = {
    region_id: regionId,
    product_id: productId,
    year,
    granularity: 'region'
  };

  const updates = {
    ...(surface !== undefined ? { surface_ha: surface } : {}),
    ...(rendement !== undefined ? { yield_qx_ha: rendement } : {}),
    ...(production !== undefined ? { production_t: production } : {})
  };

  if (existing) {
    return await prisma.agricultural_stats.update({
      where: { id: existing.id },
      data: updates
    });
  } else {
    return await prisma.agricultural_stats.create({
      data: { ...data, ...updates }
    });
  }
};
