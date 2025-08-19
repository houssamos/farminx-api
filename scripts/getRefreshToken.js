const { google } = require('googleapis');
const readline = require('readline');

// Remplace ici avec tes vraies infos
const CLIENT_ID = 'client_id_value'; // Remplace par ton client ID
// Note: Le client ID ne doit pas être exposé dans le code source
const CLIENT_SECRET = 'client_secret_value'; // Remplace par ton client secret
// Note: Le client secret ne doit pas être exposé dans le code source
const REDIRECT_URI = 'http://localhost';
const EMAIL = 'email_value'; // Remplace par ton email
// Note: L'email ne doit pas être exposé dans le code source

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Ce scope permet d’envoyer des emails via Gmail
const SCOPES = ['https://mail.google.com/'];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('1️⃣ Ouvre ce lien dans ton navigateur :\n', authUrl);
console.log('\n2️⃣ Connecte-toi avec ton compte Gmail');
console.log('3️⃣ Autorise l\'accès et colle ici le code renvoyé dans l\'URL');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('📥 Code autorisation: ', async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('\n✅ Refresh token généré avec succès :\n');
    console.log(tokens.refresh_token);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du token :', error.message);
  } finally {
    rl.close();
  }
});