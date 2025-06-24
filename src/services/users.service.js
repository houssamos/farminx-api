const bcrypt = require('bcryptjs');
const usersRepository = require('../repositories/users.repository');
const { entityToModel } = require('../mapping/user.mapping');

exports.authenticate = async (email, password) => {
  const user = await usersRepository.findByEmail(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;
  return entityToModel(user);
};

exports.createUser = async ({ email, password, firstName, lastName, role = 'user' }) => {
  const passwordHash = await bcrypt.hash(password, 15);
  const entity = await usersRepository.createUser({ email, passwordHash, firstName, lastName, role });
  return entityToModel(entity);
};

exports.isAdmin = async (userId) => {
  const user = await usersRepository.findById(userId);
  return user?.role === 'admin';
};
