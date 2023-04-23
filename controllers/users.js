const User = require('../models/users');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({massage: 'Отправлены неправильные данные'});
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const getFiltredUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() =>
      res.status(404).send({massage: 'Пользователь не существует'})
    )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({massage: 'Невалидный id'});
      }
     return res.status(500).send({ massage: 'Ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ massage: 'Отправлены неправильные данные' });
      }
      return res.status(500).send({ massage: 'Ошибка сервера' });
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
    }
  )
    .orFail(()=> res.status(404).send({ massage: 'Пользователь не существует' }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            massage: 'Переданы некорректные данные при обновлении профиля'
          });
      }
      return res.status(500).send({ massage: 'Ошибка сервера' });
    });
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.params._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() =>
      res.status(404).send({ massage: 'Пользователь не существует' })
    )
    .then((avatar) => res.send(avatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          massage: 'Переданы некорректные данные при обновлении профиля',
        });
      }
      return res.status(500).send({ massage: 'Ошибка сервера' });
    });
};

module.exports = {
  createUser,
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
};
