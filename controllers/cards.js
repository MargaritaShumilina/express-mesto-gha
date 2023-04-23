const Card = require('../models/cards');

const createCards = (req, res) => {
  const { id } = req.user;
  const { link, name } = req.body;

  Card.create({ link, name, owner: id })
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const deleteCard = (req, res,) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .then((card) => {
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(500).send('Ошибка сервера');
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .then((card) => {
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Отправлены неправильные данные' });
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
