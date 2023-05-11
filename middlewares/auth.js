const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SECRET';

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }

    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = await jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }

    req.user = payload;
    next();
  } catch (err) {
    res.status(err.statusCode).send(err.message);
  }
};

module.exports = auth;
