const regionsService = require("../services/regions.service");
const RegionDto = require("../dtos/region.dto");

function modelToDto(model) {
  return new RegionDto({ id: model.id, code: model.code, name: model.name });
}

exports.getAllRegions = async (req, res) => {
    try {
        const regions = await regionsService.getAllRegions();
        res.json(regions.map(modelToDto));
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des régions" });
    }
};

exports._modelToDto = modelToDto;
