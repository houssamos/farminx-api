const statsRepository = require("../repositories/stats.repository");
const {
  statEntityToModel,
  cultureSummaryEntityToModel,
} = require("../mapping/stat.mapping");

exports.getFilteredStats = async (filters) => {
  const result = await statsRepository.getFilteredStats(filters);
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    data: result.data.map(statEntityToModel)
  };
};

exports.getStatsByRegion = async (cultureId, year) => {
    const entities = await statsRepository.findStatsByRegion(cultureId, year);
    return entities.map(statEntityToModel);
};

exports.getCultureSummary = async (cultureId, year) => {
    const entity = await statsRepository.getSummaryByCulture(cultureId, year);
    return cultureSummaryEntityToModel(entity);
};
  
