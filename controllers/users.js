const User = require('../models/users');
const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      return res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({message: 'Ошибка сервера'});
    });
};

const getFiltredUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(PAGE_NOT_FOUND).send({ message: 'Not Found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      }
     return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(() => {
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const userMe = (user, res) => {
  if (user) {
    return res.status(200).send(user)
  }
  return res.status(PAGE_NOT_FOUND).send({ message: 'Пользователь не существует' });
}

const updateUserData = (req, res) => {
  const userId = req.user.id;

  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      userMe(user, res)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const updateUserAvatar = (req, res) => {

  const userId = req.user.id;

  const { avatar } = req.body;

  console.log(req.user.id);

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      userMe(user, res);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  createUser,
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
};
