const culturesRepository = require("../repositories/cultures.repository");
const Culture = require("../models/culture.model");

function entityToModel(entity) {
    if (!entity) return null;
    return new Culture({ id: entity.id, name: entity.name, code: entity.code });
}

exports.toModel = entityToModel;

exports.getAllCultures = async () => {
    const entities = await culturesRepository.findAll();
    return entities.map(entityToModel);
};

exports.getAvailableYears = async () => {
    return await culturesRepository.findYears();
};