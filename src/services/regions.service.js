const regionsRepository = require("../repositories/regions.repository");
const Region = require("../models/region.model");

function entityToModel(entity) {
  return new Region({ id: entity.id, code: entity.code, name: entity.name });
}

exports.getAllRegions = async () => {
  const regions = await regionsRepository.findAll();
  return regions.map(entityToModel);
};

exports._entityToModel = entityToModel; // for potential external use
