// import auth = require('../middlewares/auth');
const cardRouter = require('express').Router();
const { errors, celebrate, Joi } = require('celebrate');
const regularExp = require('../utils/constants');
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
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(30)
        .messages({
          'string.min': 'Название карточки не должно быть меньше 2 символов',
          'string.max': 'Название карточки не должно быть больше 30 символов',
          'any.required': 'Название карточки не должно быть пустым',
        })
        .required(),
      link: Joi.string()
        .regex(regularExp)
        .messages({
          'string.dataUri': 'Невалидная ссылка',
          'any.required': 'Название карточки не должно быть пустым',
        })
        .required(),
    }),
  }),
  createCards
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
