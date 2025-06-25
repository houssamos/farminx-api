const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStatsByRegion = async ({ year, productId }) => {
  const rows = await prisma.agricultural_stats.findMany({
    where: {
      year,
      product_id: productId,
      granularity: 'region'
    },
    include: {
      regions: true
    }
  });

  return rows.map(row => ({
    regionId: row.region_id,
    regionName: row.regions.name,
    regionCode: row.regions.code,
    surfaceHa: row.surface_ha,
    yieldQxHa: row.yield_qx_ha,
    productionT: row.production_t
  }));
};