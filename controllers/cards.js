const Card = require('../models/cards');
const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} = require('../errors');

const createCards = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(
          new BAD_REQUEST("Переданы некорректные данные при создании карточки.")
        );
      }
      next(error);
    });

  // const owner = req.user._id;
  // const { name, link } = req.body;

  // Card.create({ name, link, owner })
  //   .then((newCard) => {
  //     res.send(newCard);
  //   })
  //   .catch((error) => {
  //     if (error.name === "ValidationError") {
  //       next(
  //         new BAD_REQUEST("Переданы некорректные данные при создании карточки.")
  //       );
  //     } else {
  //       next(error);
  //     }
  //   });
};

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send('Ошибка сервера'));
};

const checkCardId = (card, res) => {
  if (!card) {
    throw new Error('NotFound');
  }
  return res.send(card);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => new PAGE_NOT_FOUND("Карты с указанным id не существует"))
    .then((card) => {
      if (card.owner.equals(userId)) {
        Card.findByIdAndRemove(cardId)
          .then(() =>
            res.status(200).send({ message: "Карта удалена успешно" })
          )
          .catch(next);
        return;
      }
      throw new FORBIDDEN("Доступ запрещен!");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST("Невалидный id"));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true }
  )
    .then((card) => checkCardId(card, res))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true }
  )
    .then((card) => checkCardId(card, res))
    .catch(next);
};

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
