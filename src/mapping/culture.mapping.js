const Culture = require('../models/culture.model');
const CultureDto = require('../dtos/culture.dto');
const ProductEntity = require('../entities/product.entity');

function entityToModel(entity) {
  if (!entity) return null;
  return new Culture({ id: entity.id, name: entity.name, code: entity.code });
}

function modelToDto(model) {
  if (!model) return null;
  return new CultureDto({ id: model.id, name: model.name, code: model.code });
}

module.exports = {
  entityToModel,
  modelToDto
};

