class NotificationEntity {
  constructor({ id, user_id, stats, marketplace, created_at }) {
    this.id = id;
    this.user_id = user_id;
    this.stats = stats;
    this.marketplace = marketplace;
    this.created_at = created_at;
  }
}

module.exports = NotificationEntity;
