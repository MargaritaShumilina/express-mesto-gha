const Card = require('../models/cards');
const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../errors');

const createCards = (req, res, next) => {
  const { id } = req.user;
  const { link, name } = req.body;

  Card.create({ link, name, owner: id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Отправлены неправильные данные'));
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

const getCards = (req, res, next) => {
  Card.find({})
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

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => new PAGE_NOT_FOUND('Карточки не существует'))
    .then((card) => res.status(200).send({ data: card }))
    .catch(() => next(new INTERNAL_SERVER_ERROR('Ошибка данных')));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new PAGE_NOT_FOUND('Карточки не существует'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Отправлены неправильные данные'));
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new PAGE_NOT_FOUND('Карточки не существует'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Отправлены неправильные данные'));
      }
      next(new INTERNAL_SERVER_ERROR('Ошибка данных'));
    });
};

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
