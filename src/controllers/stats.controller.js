const statsService = require("../services/stats.service");
const AgriculturalStatDto = require("../dtos/agriculturalStat.dto");
const RegionDto = require("../dtos/region.dto");
const CultureDto = require("../dtos/culture.dto");

function modelToDto(model) {
  const region = model.region ? new RegionDto(model.region) : null;
  const product = model.product ? new CultureDto(model.product) : null;
  return new AgriculturalStatDto({
    id: model.id,
    year: model.year,
    surfaceHa: model.surfaceHa,
    yieldQxHa: model.yieldQxHa,
    productionT: model.productionT,
    granularity: model.granularity,
    region,
    product,
  });
}

exports.getStatsByRegion = async (req, res) => {
    const { culture, year } = req.params;
    try {
        const stats = await statsService.getStatsByRegion(culture, parseInt(year));
        res.json(stats.map(modelToDto));
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
};

exports._modelToDto = modelToDto;
