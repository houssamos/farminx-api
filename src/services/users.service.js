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

exports.getById = async (id) => {
  const user = await usersRepository.findById(id);
  return entityToModel(user);
};

exports.isAdmin = async (userId) => {
  const user = await usersRepository.findById(userId);
  return user?.role === 'admin';
};

exports.listUsersWithNotifications = async () => {
  const rows = await usersRepository.listAllWithNotifications();
  return rows.map(({ user, notification }) => ({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    subscribed: Boolean(notification?.stats || notification?.marketplace),
    subscriptionDate: notification?.created_at,
  }));
};

exports.countUsers = async () => {
  return usersRepository.countAll();
};
