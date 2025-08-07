const usersService = require('../services/users.service');

exports.count = async (req, res) => {
  try {
    const count = await usersService.countUsers();
    res.json({ count });
  } catch (err) {
    console.error('Erreur count users:', err);
    res.status(500).json({ error: "Erreur lors du comptage des utilisateurs" });
  }
};
