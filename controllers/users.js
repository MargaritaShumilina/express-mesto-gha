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

const updateUserData = (req, res) => {
  User.findByIdAndUpdate(
    req.params._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(()=> res.status(404).send({ message: 'Пользователь не существует' }))
    .then((user) => res.status(200).send(user))
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
  User.findByIdAndUpdate(
    req.params._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() =>
      res.status(404).send({ message: 'Пользователь не существует' })
    )
    .then((avatar) => res.status(200).send(avatar))
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
