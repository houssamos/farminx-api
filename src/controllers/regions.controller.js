const regionsService = require("../services/regions.service");

exports.getAllRegions = async (req, res) => {
    try {
        const regions = await regionsService.getAllRegions();
        res.json(regions);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des régions" });
    }
};