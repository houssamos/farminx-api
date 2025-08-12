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

exports.list = async (req, res) => {
  try {
    const users = await usersService.listUsersWithNotifications();
    res.json(users);
  } catch (err) {
    console.error('Erreur list users:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};
