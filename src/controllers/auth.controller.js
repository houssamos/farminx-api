const usersService = require('../services/users.service');
const emailService = require('../services/email.service');
const jwt = require('jsonwebtoken');
const { tokenToLoginResponseDto, userModelToRegisterResponseDto } = require('../mapping/user.mapping');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
  try {
    const user = await usersService.authenticate(email, password);
    //if (!user?.email_verified)
    //  return res.status(403).json({ error: 'Email non vérifié' });
    //TODO: send verification email again? à reflechir
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json(tokenToLoginResponseDto(token));
  } catch {
    res.status(500).json({ error: "Erreur lors de l'authentification" });
  }
};

exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
  try {
    const { user, verificationToken } = await usersService.createUser({
      email,
      password,
      firstName,
      lastName,
    });
    await emailService.sendVerificationEmail(email, verificationToken);
    res.status(201).json(userModelToRegisterResponseDto(user));
  } catch {
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await usersService.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ error: 'Ancien et nouveau mot de passe requis' });
  if (newPassword.length < 6)
    return res.status(400).json({ error: 'Nouveau mot de passe trop court' });
  try {
    const ok = await usersService.changePassword(req.user.id, oldPassword, newPassword);
    if (!ok) return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    return res.sendStatus(204);
  } catch {
    return res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis' });
  try {
    const result = await usersService.requestPasswordReset(email);
    if (!result) return res.sendStatus(204);
    await emailService.sendPasswordResetEmail(email, result.token);
    return res.sendStatus(204);
  } catch {
    return res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token et mot de passe requis' });
  if (password.length < 6) return res.status(400).json({ error: 'Nouveau mot de passe trop court' });
  try {
    const ok = await usersService.resetPassword(token, password);
    if (!ok) return res.status(400).json({ error: 'Token invalide ou expiré' });
    return res.sendStatus(204);
  } catch {
    return res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token requis' });
  try {
    const ok = await usersService.verifyEmail(token);
    if (!ok) return res.status(400).json({ error: 'Token invalide' });
    return res.sendStatus(204);
  } catch {
    return res.status(500).json({ error: 'Erreur lors de la vérification de l\'email' });
  }
};
