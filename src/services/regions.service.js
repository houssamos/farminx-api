const regionsRepository = require("../repositories/regions.repository");
const Region = require("../models/region.model");

function entityToModel(entity) {
    if (!entity) return null;
    return new Region({ id: entity.id, code: entity.code, name: entity.name });
}


exports.getAllRegions = async () => {
    const entities = await regionsRepository.findAll();
    return entities.map(entityToModel);
};