class Notification {
  constructor({ id, userId, stats, marketplace, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.stats = stats;
    this.marketplace = marketplace;
    this.createdAt = createdAt;
  }
}

module.exports = Notification;
