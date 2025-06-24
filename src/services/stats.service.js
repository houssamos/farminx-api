const statsRepository = require("../repositories/stats.repository");
const {
  statEntityToModel,
  productSummaryEntityToModel,
} = require("../mapping/stat.mapping");

exports.statEntityToModel = statEntityToModel;
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
  
