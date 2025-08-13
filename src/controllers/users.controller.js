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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = await usersService.listUsersWithNotifications({ page, limit });
    res.json(result);
  } catch (err) {
    console.error('Erreur list users:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await usersService.deleteUser(id);
    if (!deleted) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.status(204).send();
  } catch (err) {
    console.error('Erreur suppression user:', err);
    res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
  }
};
