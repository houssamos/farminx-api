const statsService = require("../services/stats.service");
const StatDto = require("../dtos/stat.dto");
const ProductSummaryDto = require("../dtos/product-summary.dto");

function statModelToDto(model) {
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

exports.statModelToDto = statModelToDto;

exports.getAgriculturalStats = async (req, res) => {
  try {
    const filters = {
      year: req.query.year ? parseInt(req.query.year) : undefined,
      regionId: req.query.regionId ? parseInt(req.query.regionId) : undefined,
      productId: req.query.productId ? parseInt(req.query.productId) : undefined,
      granularity: req.query.granularity,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };

    const result = await statsService.getFilteredStats(filters);
    res.json({
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.data.map(statModelToDto)
    });
  } catch (err) {
    console.error("Erreur getAgriculturalStats:", err);
    res.status(500).json({ error: "Erreur lors du filtrage des statistiques" });
  }
};

exports.getStatsByRegion = async (req, res) => {
    const productId = parseInt(req.params.culture);
    const year = parseInt(req.params.year);
    try {
        const stats = await statsService.getStatsByRegion(parseInt(productId), parseInt(year));
        res.json(stats.map(statModelToDto));
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
};

exports.getProductSummary = async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const year = req.query.year ? parseInt(req.query.year) : null;
      if (isNaN(productId)) return res.status(400).json({ error: "ID produit invalide" });
  
      const summary = await statsService.getProductSummary(productId, year);
      res.json(new ProductSummaryDto(summary));
    } catch (err) {
      console.error("Erreur getProductSummary:", err);
      res.status(500).json({ error: "Erreur lors du calcul du résumé produit" });
    }
  };