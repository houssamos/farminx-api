const statsRepository = require("../repositories/stats.repository");

exports.getStatsByRegion = async (culture, year) => {
    return await statsRepository.findStatsByRegion(culture, year);
};