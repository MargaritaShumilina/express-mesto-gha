const User = require('../models/users');
const handleErrors = require('../middlewares/handleErrors');

const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} = require('../errors');

const getFiltredUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new PAGE_NOT_FOUND('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Невалидный id'));
        return;
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const userMe = (user, res, next) => {
  if (user) {
    return res.send(user);
  }
  throw next(new PAGE_NOT_FOUND('NotFound'));
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(new PAGE_NOT_FOUND("Пользователь с указанным _id не найден."));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BAD_REQUEST(
            "Переданы некорректные данные при обновлении профиля."
          )
        );
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;

  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      userMe(user, res);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

const getMyProfile = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new PAGE_NOT_FOUND("Пользователь не найден"));
      }
      res.send({ data: user });
    })
    .catch((err) => next(err));
};

module.exports = {
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
  getMyProfile,
};
