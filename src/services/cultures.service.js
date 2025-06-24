const culturesRepository = require("../repositories/cultures.repository");
const { entityToModel } = require("../mapping/culture.mapping");

exports.toModel = entityToModel;

exports.getAllCultures = async () => {
    const entities = await culturesRepository.findAll();
    return entities.map(entityToModel);
};

exports.getAvailableYears = async () => {
    return await culturesRepository.findYears();
};
