const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SECRET';

function generateToken(id) {
  return jwt.sign({ id }, SECRET_KEY);
}

module.exports = generateToken;
