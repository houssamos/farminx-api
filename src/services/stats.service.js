const statsRepository = require("../repositories/stats.repository");
const Stat = require("../models/stat.model");
const Region = require("../models/region.model");
const Culture = require("../models/culture.model");

function entityToModel(entity) {
    if (!entity) return null;
    const region = entity.region
        ? new Region({ id: entity.region.id, code: entity.region.code, name: entity.region.name })
        : undefined;
    const product = entity.product
        ? new Culture({ id: entity.product.id, name: entity.product.name, code: entity.product.code })
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

exports.getStatsByRegion = async (culture, year) => {
    const entities = await statsRepository.findStatsByRegion(culture, year);
    return entities.map(entityToModel);
};