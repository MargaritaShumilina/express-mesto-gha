const Card = require('../models/cards');

const createCards = (req, res, next) => {
  const { id } = req.user;
  const { link, name } = req.body;

  Card.create({ link, name, owner: id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ massage: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ massage: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() =>
      res.status(404).send({ massage: 'Карточки не существует' })
    )
    .then((card) => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send('Ошибка сервера'));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => res.status(404).send({ massage: 'Карточки не существует' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ massage: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => res.status(404).send({ massage: 'Карточки не существует' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ massage: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
