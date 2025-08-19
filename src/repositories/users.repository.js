const prisma = require('../config/prisma');
const UserEntity = require('../entities/user.entity');
const NotificationEntity = require('../entities/notification.entity');

exports.findByEmail = async (email) => {
  const row = await prisma.users.findUnique({ where: { email } });
  return row ? new UserEntity(row) : null;
};

exports.createUser = async ({ email, passwordHash, firstName, lastName, role, verificationToken }) => {
  const row = await prisma.users.create({
    data: {
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      role,
      verification_token: verificationToken,
      email_verified: false,
    },
  });
  return new UserEntity(row);
};

exports.findById = async (id) => {
  const row = await prisma.users.findUnique({ where: { id } });
  return row ? new UserEntity(row) : null;
};

exports.deleteById = async (id) => {
  const row = await prisma.users.delete({ where: { id } });
  return row ? new UserEntity(row) : null;
};

exports.updatePassword = async (id, passwordHash) => {
  const row = await prisma.users.update({
    where: { id },
    data: { password_hash: passwordHash },
  });
  return row ? new UserEntity(row) : null;
};

exports.countAll = async () => {
  return prisma.users.count();
};

exports.listAllWithNotifications = async ({ page = 1, limit = 50 } = {}) => {
  const [rows, total] = await Promise.all([
    prisma.users.findMany({
      include: { notifications: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
    prisma.users.count(),
  ]);

  return {
    rows: rows.map((row) => ({
      user: new UserEntity(row),
      notification: row.notifications ? new NotificationEntity(row.notifications) : null,
    })),
    total,
  };
};

exports.listByIds = async (ids) => {
  if (!ids.length) return [];
  const rows = await prisma.users.findMany({ where: { id: { in: ids } } });
  return rows.map((row) => new UserEntity(row));
};

exports.savePasswordResetToken = async (id, token, expires) => {
  const row = await prisma.users.update({
    where: { id },
    data: { password_reset_token: token, password_reset_expires: expires },
  });
  return row ? new UserEntity(row) : null;
};

exports.findByPasswordResetToken = async (token) => {
  const row = await prisma.users.findFirst({ where: { password_reset_token: token } });
  return row ? new UserEntity(row) : null;
};

exports.clearPasswordResetToken = async (id) => {
  const row = await prisma.users.update({
    where: { id },
    data: { password_reset_token: null, password_reset_expires: null },
  });
  return row ? new UserEntity(row) : null;
};

exports.findByVerificationToken = async (token) => {
  const row = await prisma.users.findFirst({ where: { verification_token: token } });
  return row ? new UserEntity(row) : null;
};

exports.markEmailVerified = async (id) => {
  const row = await prisma.users.update({
    where: { id },
    data: { email_verified: true, verification_token: null },
  });
  return row ? new UserEntity(row) : null;
};
