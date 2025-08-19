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

exports.deleteUser = async (id) => {
  try {
    const entity = await usersRepository.deleteById(id);
    return entityToModel(entity);
  } catch (err) {
    if (err.code === 'P2025') return null;
    throw err;
  }
};

exports.isAdmin = async (userId) => {
  const user = await usersRepository.findById(userId);
  return user?.role === 'admin';
};

exports.changePassword = async (id, oldPassword, newPassword) => {
  const user = await usersRepository.findById(id);
  if (!user) return false;
  const match = await bcrypt.compare(oldPassword, user.password_hash);
  if (!match) return false;
  const passwordHash = await bcrypt.hash(newPassword, 15);
  await usersRepository.updatePassword(id, passwordHash);
  return true;
};

exports.listUsersWithNotifications = async ({ page = 1, limit = 50 } = {}) => {
  const { rows, total } = await usersRepository.listAllWithNotifications({ page, limit });
  const data = rows.map(({ user, notification }) => {
    const statsSubscribed = Boolean(notification?.stats);
    const marketplaceSubscribed = Boolean(notification?.marketplace);

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      statsSubscribed,
      marketplaceSubscribed,
      subscribed: statsSubscribed || marketplaceSubscribed,
      subscriptionDate: notification?.created_at,
    };
  });

  return { total, page, limit, data };
};

exports.countUsers = async () => {
  return usersRepository.countAll();
};
