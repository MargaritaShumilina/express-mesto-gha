// import auth = require('../middlewares/auth');
const cardRouter = require('express').Router();
const { errors, celebrate, Joi } = require('celebrate');
const validateUrl = require('../utils/validate');
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
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string()
          .required()
          .custom(validateUrl, 'custom validate url'),
      })
      .unknown(false),
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
