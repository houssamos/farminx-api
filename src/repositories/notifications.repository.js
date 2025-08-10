const prisma = require('../config/prisma');
const NotificationEntity = require('../entities/notification.entity');

exports.upsert = async ({ userId, stats = false, marketplace = false }) => {
  const row = await prisma.notifications.upsert({
    where: { user_id: userId },
    update: { stats, marketplace },
    create: { user_id: userId, stats, marketplace },
  });
  return new NotificationEntity(row);
};

exports.findByUserId = async (userId) => {
  const row = await prisma.notifications.findUnique({ where: { user_id: userId } });
  return row ? new NotificationEntity(row) : null;
};
