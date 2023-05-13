const bcrypt = require('bcryptjs');

const User = require('../models/users');
const generateToken = require('../utils/token');
const handleErrors = require('../middlewares/handleErrors');

const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} = require('../errors');

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BAD_REQUEST('Отправлены неправильные данные');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UNAUTHORIZED('Неправильные почта или пароль');
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UNAUTHORIZED('Неправильные почта или пароль');
          }

          const token = generateToken(user._id);

          res.send({ token });
        })
        .catch(next);
          // () => {
          // next(new INTERNAL_SERVER_ERROR('Ошибка сервера'));
        // });
    });
    // .catch(next);
    //   (err) => {
    //   handleErrors(err);
    // });
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
    throw new UNAUTHORIZED('Неправильные почта или пароль');
  }

  try {
    // const user = await User.findOne({ email });
    // if (user) {
    //   throw new CONFLICT("Пользовтель уже существует");
    // }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(201).send({ newUser });
  } catch (err) {
    if (err.code === 11000) {
      next(new CONFLICT('Пользователь с такой почтой уже зарегистрирвован'));
      return;
    }
    next(err);
  }
};

module.exports = { login, createUser };
