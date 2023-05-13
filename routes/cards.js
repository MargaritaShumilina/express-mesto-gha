// import auth = require('../middlewares/auth');
const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regularExp = require('../utils/constants');
const {
  createCards,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.post(
  '/',
  celebrate({
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(30)
        .required(),
      link: Joi.string()
        .regex(regularExp)
        .required(),
    }),
  }),
  createCards,
);
cardRouter.get('/', getCards);
cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().length(24),
      })
      .unknown(false),
  }),
  deleteCard,
);
cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().length(24),
      })
      .unknown(false),
  }),
  likeCard,
);
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required().length(24),
      })
      .unknown(false),
  }),
  dislikeCard,
);

module.exports = cardRouter;
