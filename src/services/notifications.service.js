const notificationsRepository = require('../repositories/notifications.repository');
const { entityToModel } = require('../mapping/notification.mapping');

exports.subscribe = async (userId, { stats = false, marketplace = false }) => {
  const entity = await notificationsRepository.upsert({ userId, stats, marketplace });
  return entityToModel(entity);
};

exports.getPreferences = async (userId) => {
  const entity = await notificationsRepository.findByUserId(userId);
  return entityToModel(entity);
};
