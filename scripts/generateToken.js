const jwt = require('jsonwebtoken');
require('dotenv').config();

const args = process.argv.slice(2);
const role = args[0] || 'user'; // 'user' ou 'app'
const email = args[1] || 'user@example.com';
const payload = role === 'user'
  ? { role: 'user', email }
  : { role: 'app', appName: email };

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

console.log(`\n🔐 Token JWT (${role}):\n\n${token}\n`);
