const statsRepository = require("../repositories/stats.repository");
const Stat = require("../models/stat.model");
const Region = require("../models/region.model");
const Culture = require("../models/culture.model");

function entityToModel(entity) {
    if (!entity) return null;
    const region = entity.regions
        ? new Region({ id: entity.regions.id, code: entity.regions.code, name: entity.regions.name })
        : undefined;
    const product = entity.products
        ? new Culture({ id: entity.products.id, name: entity.products.name, code: entity.products.code })
        : undefined;
    return new Stat({
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

exports.toModel = entityToModel;

exports.getStatsByRegion = async (productId, year) => {
    const entities = await statsRepository.findStatsByRegion(productId, year);
    return entities.map(entityToModel);
};

exports.getProductSummary = async (productId, year) => {
    return await statsRepository.getSummaryByProduct(productId, year);
};
  