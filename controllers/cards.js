const Card = require('../models/cards');
const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require('../errors');

const createCards = (req, res, next) => {
  const { id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BAD_REQUEST('Переданы некорректные данные при создании карточки.'),
        );
      }
      return next(error);
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send('Ошибка сервера'));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  const userId = req.user.id;

  Card.findById(cardId)
    .orFail(() => new PAGE_NOT_FOUND('Карточки с указанным id не существует'))
    .then((card) => {
      if (card.owner.equals(userId)) {
        Card.findByIdAndRemove(cardId)
          .then(() => res.send({ message: 'Карточка удалена успешно' }))
          .catch(next);
        return;
      }
      throw new FORBIDDEN('Доступ запрещен!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST('Невалидный id'));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const owner = req.user.id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .orFail(() => new PAGE_NOT_FOUND('Карточки с указанным id не существует'))
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const owner = req.user.id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .orFail(() => new PAGE_NOT_FOUND('Карточки с указанным id не существует'))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
