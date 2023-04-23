const cardRouter = require('express').Router();
const {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.post('/', createCards);
cardRouter.get('/', getCards);
cardRouter.delete('/:id', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
