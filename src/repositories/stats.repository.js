const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const StatEntity = require('../entities/stat.entity');
const CultureSummaryEntity = require('../entities/culture-summary.entity');
const logger = require('../utils/logger');

exports.getFilteredStats = async ({ year, regionId, cultureId, granularity, page = 1, limit = 50 }) => {
  const where = {
    ...(year ? { year } : {}),
    ...(regionId ? { region_id: regionId } : {}),
    ...(cultureId ? { product_id: cultureId } : {}),
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

exports.findStatsByRegion = async (cultureId, year) => {
  const query = {
    product_id: cultureId,
    year: parseInt(year),
    granularity: 'region'
  };
    
 logger.debug("Recherche Prisma :", query);
  
  const results = await prisma.agricultural_stats.findMany({
    where: {
      product_id: cultureId,
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

exports.upsertStat = async ({ regionId, cultureId, year, surface, rendement, production }) => {
    const existing = await prisma.agricultural_stats.findFirst({
      where: {
        region_id: regionId,
        product_id: cultureId,
        year: year,
        granularity: 'region'
      }
    });
  
    const data = {
      region_id: regionId,
      product_id: cultureId,
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

  exports.getSummaryByCulture = async (cultureId, year) => {
    const where = {
      product_id: cultureId,
      granularity: 'region',
      ...(year ? { year } : {})
    };

    const [product] = await prisma.products.findMany({
      where: { id: cultureId },
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
  
  return new CultureSummaryEntity({
    cultureId,
    name: product?.name ?? null,
    totalSurface: result._sum.surface_ha ?? 0,
    totalProduction: result._sum.production_t ?? 0,
    avgYield: result._avg.yield_qx_ha ?? null,
    minYear: result._min.year,
    maxYear: result._max.year
  });
};
  