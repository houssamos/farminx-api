const prisma = require('../config/prisma');

exports.getStatsByRegion = async ({ year, productId }) => {
  if (!year || !productId) {
    throw new Error("⚠️ year et productId sont requis pour getStatsByRegion");
  }

  const results = await prisma.agricultural_stats.findMany({
    where: {
      year: parseInt(year),
      product_id: productId,
      granularity: 'region',
      region_id: { not: null } // sécurité
    },
    include: {
      regions: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    },
    orderBy: {
      region_id: 'asc'
    }
  });

  // Mapping clair des résultats
  return results.map(stat => ({
    regionId: stat.region_id,
    regionName: stat.regions?.name || null,
    regionCode: stat.regions?.code || null,
    surfaceHa: stat.surface_ha ?? null,
    yieldQxHa: stat.yield_qx_ha ?? null,
    productionT: stat.production_t ?? null
  }));
};