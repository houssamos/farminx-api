const prisma = require('../config/prisma');

exports.findByEmail = async (email) => {
  return await prisma.users.findUnique({ where: { email } });
};

exports.createUser = async ({ email, passwordHash, firstName, lastName, role }) => {
  return await prisma.users.create({ data: { email, password_hash: passwordHash, first_name: firstName, last_name: lastName, role } });
};
