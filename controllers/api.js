const bcrypt = require('bcryptjs');

const User = require('../models/users');
const generateToken = require('../utils/token');

const { UNAUTHORIZED, CONFLICT, BAD_REQUEST } = require('../errors');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UNAUTHORIZED('Неверные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UNAUTHORIZED('Неверные почта или пароль'));
        }
        const token = generateToken(user._id);
        return res.send({ token });
      });
    })
    .catch(next);
};

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(201).send({ newUser });
  // Спасибо за ваши комментарии :)
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BAD_REQUEST('Ошибка данных'));
    } else if (err.code === 11000) {
      next(new CONFLICT('Пользователь с такой почтой уже существует'));
    } else { next(err); }
  }
};

module.exports = { login, createUser };
