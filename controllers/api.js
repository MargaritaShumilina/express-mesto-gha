const bcrypt = require('bcryptjs');

const User = require('../models/users');
const generateToken = require('../utils/token');

const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require('../errors');

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BAD_REQUEST('Отправлены неправильные данные'));
    return;
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new UNAUTHORIZED('Неправильные почта или пароль'));

        return;
      }
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UNAUTHORIZED('Неправильные почта или пароль'));
            return;
          }

          const token = generateToken(user._id);

          res.status(200).send({ token });
        })
        .catch(() => {
          next(new INTERNAL_SERVER_ERROR('Ошибка сервера'));
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BAD_REQUEST('Отправлены неправильные данные'));
      }
      return next(new INTERNAL_SERVER_ERROR('Ошибка сервера'));
    });
};

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    next(new BAD_REQUEST('Отправлены неправильные данные'));
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      next(new BAD_REQUEST('Пользовтель уже существует'));
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res
      .status(201)
      .send({
        massage: `Пользователь ${newUser.email} успешно зарегистрирован`,
      });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BAD_REQUEST('Отправлены неправильные данные'));
      return;
    }
    next(new INTERNAL_SERVER_ERROR('Ошибка сервера'));
  }
};

module.exports = { login, createUser };
