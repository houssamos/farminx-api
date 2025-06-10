const culturesService = require("../services/cultures.service");

exports.getAllCultures = async (req, res) => {
    try {
        const cultures = await culturesService.getAllCultures();
        res.json(cultures);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des cultures" });
    }
};

exports.getAvailableYears = async (req, res) => {
    try {
        const years = await culturesService.getAvailableYears();
        res.json(years);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des années" });
    }
};