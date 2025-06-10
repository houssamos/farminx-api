const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findStatsByRegion = async (culture, year) => {
    return await prisma.agricultural_stats.findMany({
        where: {
            year: year,
            product: { id: culture },
            granularity: 'region'
        },
        include: {
            region: true,
            product: true
        }
    });
};

exports.upsertStat = async ({ regionId, productId, year, type, value }) => {
    const existing = await prisma.agricultural_stats.findFirst({
      where: {
        regionId,
        productId,
        year,
        granularity: 'region'
      }
    });
  
    const data = {
      regionId,
      productId,
      year,
      granularity: 'region'
    };
    if (existing) {
      return await prisma.agricultural_stats.update({
        where: { id: existing.id },
        data: { [`${type.toLowerCase()}${type === 'SURF' ? 'Ha' : type === 'REND' ? 'QxHa' : 'T'}`]: value }
      });
    } else {
      return await prisma.agriculturalStat.create({
        data: {
          ...data,
          [`${type.toLowerCase()}${type === 'SURF' ? 'Ha' : type === 'REND' ? 'QxHa' : 'T'}`]: value
        }
      });
    }
  };
  