const Card = require('../models/cards');
const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} = require('../errors');
const handleErrors = require('../middlewares/handleErrors');

const createCards = (req, res) => {
  const userId = req.user._id;
  // const { _id } = req.user;
  const { link, name } = req.body;

  Card.create({ link, name, owner: userId })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      handleErrors(err);
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send('Ошибка сервера'));
};

const cardId = (card, res) => {
  if (!card) {
    throw new Error('NotFound');
  }
  return res.send(card);
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;

  const userId = req.user._id;

  Card.findById(id)
    .then((card) => {
      if (card.owner.equals(userId)) {
        Card.findByIdAndRemove(id)
          .then(() => res.send({ message: 'Карточка удалена успешно' }))
          .catch(next);
        return;
      }
      throw new FORBIDDEN('Доступ запрещен!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Отправлены неправильные данные' });
      }
      if (err.message === 'NotFound') {
        return res.status(PAGE_NOT_FOUND).send({ message: 'Not Found' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка сервера');
    });
};

const likeCard = (req, res, next) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new PAGE_NOT_FOUND("Not Found"))
    .then((card) => cardId(card, res))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("Отправлены неправильные данные"));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => cardId(card, res))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("Отправлены неправильные данные"));
      }
      next(err);
    });
};

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
