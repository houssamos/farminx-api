const Notification = require('../models/notification.model');

function entityToModel(entity) {
  if (!entity) return null;
  return new Notification({
    id: entity.id,
    userId: entity.user_id,
    stats: entity.stats,
    marketplace: entity.marketplace,
    createdAt: entity.created_at,
  });
}

module.exports = { entityToModel };
