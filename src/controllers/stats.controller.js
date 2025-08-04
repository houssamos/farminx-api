const statsService = require("../services/stats.service");
const { statModelToDto, cultureSummaryModelToDto } = require("../mapping/stat.mapping");
const CultureSummaryDto = require("../dtos/culture-summary.dto");
const logger = require("../utils/logger");

exports.getAgriculturalStats = async (req, res) => {
  try {
    const filters = {
      year: req.query.year ? parseInt(req.query.year) : undefined,
      regionId: req.query.regionId ? req.query.regionId : undefined,
      cultureId: req.query.cultureId ? req.query.cultureId : undefined,
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
    const cultureId = req.params.cultureId;
    const year = parseInt(req.params.year);
    try {
        const stats = await statsService.getStatsByRegion(parseInt(cultureId), parseInt(year));
        res.json(stats.map(statModelToDto));
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
};

exports.getCultureSummary = async (req, res) => {
    try {
      const cultureId = req.params.id;
      const year = req.query.year ? parseInt(req.query.year) : null;
      if (!cultureId || cultureId == null) return res.status(400).json({ error: "ID culture invalide" });

      const summary = await statsService.getCultureSummary(cultureId, year);
      res.json(cultureSummaryModelToDto(summary));
    } catch (err) {
      console.error("Erreur getCultureSummary:", err);
      res.status(500).json({ error: "Erreur lors du calcul du résumé culture" });
    }
  };
