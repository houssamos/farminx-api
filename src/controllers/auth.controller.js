const usersService = require('../services/users.service');
const jwt = require('jsonwebtoken');
const { tokenToLoginResponseDto, userModelToRegisterResponseDto } = require('../mapping/user.mapping');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
  try {
    const user = await usersService.authenticate(email, password);
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json(tokenToLoginResponseDto(token));
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'authentification" });
  }
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
  try {
    const user = await usersService.createUser({ email, password, firstName, lastName });
    res.status(201).json(userModelToRegisterResponseDto(user));
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};
