const regionsService = require("../services/regions.service");
const { modelToDto } = require("../mapping/region.mapping");

exports.toDto = modelToDto;

exports.getAllRegions = async (req, res) => {
    try {
        const regions = await regionsService.getAllRegions();
        res.json(regions.map(modelToDto));
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des régions" });
    }
};
