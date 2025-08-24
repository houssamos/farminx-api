const { sendMail } = require('../utils/mailer');

exports.sendPasswordResetEmail = async (email, token) => {
  await sendMail({
    to: email,
    subject: 'Réinitialisation de mot de passe',
    text: `Utilisez ce jeton pour réinitialiser votre mot de passe : ${token}`,
  });
};

exports.sendVerificationEmail = async (email, token) => {
  await sendMail({
    to: email,
    subject: 'Vérification de votre adresse email',
    text: `Veuillez vérifier votre email avec ce jeton : ${token}`,
  });
};
