const bcrypt = require('bcryptjs');
const usersRepository = require('../repositories/users.repository');
const User = require('../models/user.model');

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

exports.authenticate = async (email, password) => {
  const user = await usersRepository.findByEmail(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;
  return entityToModel(user);
};

exports.createUser = async ({ email, password, firstName, lastName, role = 'user' }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const entity = await usersRepository.createUser({ email, passwordHash, firstName, lastName, role });
  return entityToModel(entity);
};
