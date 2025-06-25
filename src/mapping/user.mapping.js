const User = require('../models/user.model');
const UserEntity = require('../entities/user.entity');

function entityToModel(entity) {
  if (!entity) return null;
  return new User({
    id: entity.id,
    email: entity.email,
    firstName: entity.first_name,
    lastName: entity.last_name,
    role: entity.role,
  });
}

module.exports = {
  entityToModel,
};

