const statsService = require("../services/stats.service");
const StatDto = require("../dtos/stat.dto");

function modelToDto(model) {
    return new StatDto({
        id: model.id,
        year: model.year,
        surfaceHa: model.surfaceHa,
        yieldQxHa: model.yieldQxHa,
        productionT: model.productionT,
        granularity: model.granularity,
        region: model.region,
        product: model.product,
    });
}

exports.toDto = modelToDto;

exports.getStatsByRegion = async (req, res) => {
    const { culture, year } = req.params;
    try {
        const stats = await statsService.getStatsByRegion(parseInt(culture), parseInt(year));
        res.json(stats.map(modelToDto));
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
};