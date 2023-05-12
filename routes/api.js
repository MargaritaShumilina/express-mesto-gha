const apiRouter = require('express').Router();
const { errors, Joi, celebrate } = require('celebrate');
const {
  login,
  createUser,
} = require('../controllers/api');

const validateUrl = require('../utils/validate');

apiRouter.post(
  '/signin',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string()
          .required()
          .email({ tlds: { allow: false } }),
        password: Joi.string().required(),
      })
      .unknown(false),
  }),
  login,
);
apiRouter.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string()
          .required()
          .email({ tlds: { allow: false } }),
        password: Joi.string().required(),
        about: Joi.string().min(2).max(30),
        name: Joi.string().min(2).max(30),
        avatar: Joi.string().custom(validateUrl, 'custom validate url'),
      })
      .unknown(false),
  }),
  createUser,
);

module.exports = apiRouter;
