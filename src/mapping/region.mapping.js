const Region = require('../models/region.model');
const RegionDto = require('../dtos/region.dto');

function entityToModel(entity) {
  if (!entity) return null;
  return new Region({ id: entity.id, code: entity.code, name: entity.name });
}

function modelToDto(model) {
  if (!model) return null;
  return new RegionDto({ id: model.id, code: model.code, name: model.name });
}

module.exports = {
  entityToModel,
  modelToDto
};

