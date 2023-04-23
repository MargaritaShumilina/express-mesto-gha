const User = require('../models/users');
const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../errors');

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Отправлены неправильные данные'));
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

const getFiltredUser = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(
      () => new PAGE_NOT_FOUND('Пользователь не существует'),
    )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Невалидный id'));
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Отправлены неправильные данные'));
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

const updateUserData = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(
      () => new PAGE_NOT_FOUND('Пользователь не существует'),
    )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BAD_REQUEST('Переданы некорректные данные при обновлении профиля'),
        );
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new PAGE_NOT_FOUND('Пользователь не существует'))
    .then((avatar) => res.send(avatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BAD_REQUEST('Переданы некорректные данные при обновлении профиля'),
        );
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

module.exports = {
  createUser,
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
};
