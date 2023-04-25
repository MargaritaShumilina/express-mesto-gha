const Card = require('../models/cards');
const { PAGE_NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require('../errors');

//Благодарю за ваши комментарии, с orFail было особенно полезно ) status 200 пока осталю для себя, но в следующей ПР почищу

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
          .status(BAD_REQUEST)
          .send({ message: 'Отправлены неправильные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка сервера');
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(() => {
      return res.status(INTERNAL_SERVER_ERROR).send('Ошибка сервера');
    });
};

const cardId = (card, res) => {
  if (!card) {
    throw new Error('NotFound');
  }
  return res.status(200).send(card);
};

const deleteCard = (req, res,) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => cardId(card, res))
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .then((card) =>
      cardId(card, res)
  )
    .catch((err) => {
      console.log(err.message);
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .then((card) => cardId(card, res))
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

module.exports = {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
