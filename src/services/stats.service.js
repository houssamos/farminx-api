const statsRepository = require("../repositories/stats.repository");
const Stat = require("../models/stat.model");
const Region = require("../models/region.model");
const Culture = require("../models/culture.model");
const ProductSummary = require("../models/product-summary.model");

function statEntityToModel(entity) {
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

exports.statEntityToModel = statEntityToModel;

function productSummaryEntityToModel(entity) {
    if (!entity) return null;
    return new ProductSummary({
        productId: entity.productId,
        name: entity.name,
        totalSurface: entity.totalSurface,
        avgYield: entity.avgYield,
        totalProduction: entity.totalProduction,
        minYear: entity.minYear,
        maxYear: entity.maxYear
    });
}

exports.productSummaryEntityToModel = productSummaryEntityToModel;

exports.getFilteredStats = async (filters) => {
  const result = await statsRepository.getFilteredStats(filters);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    data: result.data.map(statEntityToModel)
  };
};

exports.getStatsByRegion = async (productId, year) => {
    const entities = await statsRepository.findStatsByRegion(productId, year);
    return entities.map(statEntityToModel);
};

exports.getProductSummary = async (productId, year) => {
    const entity = await statsRepository.getSummaryByProduct(productId, year);
    return productSummaryEntityToModel(entity);
};
  