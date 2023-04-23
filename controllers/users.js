const User = require('../models/users');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      return res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(500).send({message: 'Ошибка сервера'});
    });
};

const getFiltredUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() =>
      res.status(404).send({message: 'Пользователь не существует'})
    )
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id' });
      }
     return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const userMe = (user, res) => {
  if (user) {
    return res.status(200).send(user)
  }
  return res.status(404).send({ message: 'Пользователь не существует' });
}

const updateUserData = (req, res) => {
  const userId = req.user.id;

  const { name, about } = req.body;
console.log(req.user.id);

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
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
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
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  createUser,
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
};
