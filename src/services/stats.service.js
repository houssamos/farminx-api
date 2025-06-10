const statsRepository = require("../repositories/stats.repository");
const AgriculturalStat = require("../models/agriculturalStat.model");
const Region = require("../models/region.model");
const Culture = require("../models/culture.model");

function entityToModel(entity) {
  const region = entity.regions
    ? new Region({ id: entity.regions.id, code: entity.regions.code, name: entity.regions.name })
    : null;
  const product = entity.products
    ? new Culture({ name: entity.products.name })
    : null;
  return new AgriculturalStat({
    id: entity.id,
    year: entity.year,
    surfaceHa: entity.surface_ha,
    yieldQxHa: entity.yield_qx_ha,
    productionT: entity.production_t,
    granularity: entity.granularity,
    region,
    product,
  });
}

exports.getStatsByRegion = async (culture, year) => {
  const stats = await statsRepository.findStatsByRegion(culture, year);
  return stats.map(entityToModel);
};

exports._entityToModel = entityToModel;
