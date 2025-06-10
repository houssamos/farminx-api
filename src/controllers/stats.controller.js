const statsService = require("../services/stats.service");

exports.getStatsByRegion = async (req, res) => {
    const { culture, year } = req.params;
    try {
        const stats = await statsService.getStatsByRegion(culture, parseInt(year));
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
};