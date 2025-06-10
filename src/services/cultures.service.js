const culturesRepository = require("../repositories/cultures.repository");
const Culture = require("../models/culture.model");

function entityToModel(entity) {
  return new Culture({ name: entity.name });
}

exports.getAllCultures = async () => {
  const cultures = await culturesRepository.findAll();
  return cultures.map(entityToModel);
};

exports.getAvailableYears = async () => {
  return await culturesRepository.findYears();
};

exports._entityToModel = entityToModel;
