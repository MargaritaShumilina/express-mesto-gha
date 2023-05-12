const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SECRET';

function generateToken(id) {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: '7d',
  });
}

module.exports = generateToken;
