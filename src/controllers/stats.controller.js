const statsService = require("../services/stats.service");
const StatDto = require("../dtos/stat.dto");
const ProductSummaryDto = require("../dtos/product-summary.dto");

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
    const productId = parseInt(req.params.culture);
    const year = parseInt(req.params.year);
    try {
        const stats = await statsService.getStatsByRegion(parseInt(productId), parseInt(year));
        res.json(stats.map(modelToDto));
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