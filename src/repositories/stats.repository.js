const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const StatEntity = require('../entities/stat.entity');
const ProductSummaryEntity = require('../entities/product-summary.entity');
const logger = require('../utils/logger');

exports.getFilteredStats = async ({ year, regionId, productId, granularity, page = 1, limit = 50 }) => {
  const where = {
    ...(year ? { year } : {}),
    ...(regionId ? { region_id: regionId } : {}),
    ...(productId ? { product_id: productId } : {}),
    ...(granularity ? { granularity } : {})
  };

  const results = await prisma.agricultural_stats.findMany({
    where,
    include: {
      regions: true,
      products: true
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { year: "desc" }
  });

  const total = await prisma.agricultural_stats.count({ where });

  return {
    total,
    page,
    limit,
    data: results.map((row) => new StatEntity(row))
  };
};

exports.findStatsByRegion = async (productId, year) => {
  const query = {
    product_id: productId,
    year: parseInt(year),
    granularity: 'region'
  };
    
 logger.debug("Recherche Prisma :", query);
  
  const results = await prisma.agricultural_stats.findMany({
    where: {
      product_id: productId,
      year: year,
      granularity: 'region'
    },
    include: {
      regions: true,
      products: true
    }
  });
  logger.debug("Résultats :", results);
  return results.map((row) => new StatEntity(row));
};

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
    const row = await prisma.agricultural_stats.update({
      where: { id: existing.id },
      data: updates
    });
    return new StatEntity(row);
  } else {
    const row = await prisma.agricultural_stats.create({
      data: { ...data, ...updates }
    });
    return new StatEntity(row);
  }
};

  exports.getSummaryByProduct = async (productId, year) => {
    const where = {
      product_id: productId,
      granularity: 'region',
      ...(year ? { year } : {})
    };
  
    const [product] = await prisma.products.findMany({
      where: { id: productId },
      take: 1
    });
  
    const result = await prisma.agricultural_stats.aggregate({
      where,
      _sum: {
        surface_ha: true,
        production_t: true
      },
      _avg: {
        yield_qx_ha: true
      },
      _min: {
        year: true
      },
      _max: {
        year: true
      }
    });
  
  return new ProductSummaryEntity({
    productId,
    name: product?.name ?? null,
    totalSurface: result._sum.surface_ha ?? 0,
    totalProduction: result._sum.production_t ?? 0,
    avgYield: result._avg.yield_qx_ha ?? null,
    minYear: result._min.year,
    maxYear: result._max.year
  });
};
  