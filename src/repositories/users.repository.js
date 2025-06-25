const prisma = require('../config/prisma');
const UserEntity = require('../entities/user.entity');

exports.findByEmail = async (email) => {
  const row = await prisma.users.findUnique({ where: { email } });
  return row ? new UserEntity(row) : null;
};

exports.createUser = async ({ email, passwordHash, firstName, lastName, role }) => {
  const row = await prisma.users.create({ data: { email, password_hash: passwordHash, first_name: firstName, last_name: lastName, role } });
  return new UserEntity(row);
};

exports.findById = async (id) => {
  const row = await prisma.users.findUnique({ where: { id } });
  return row ? new UserEntity(row) : null;
};