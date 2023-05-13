const router = require('express').Router();
const cardRouter = require('./cards');
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const validateUrl = require('../utils/validate');
const { login, createUser } = require('../controllers/api');
const { errors, celebrate, Joi } = require('celebrate');
const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} = require("../errors");

// router.post(
//   '/signin',
//   celebrate({
//     body: Joi.object()
//       .keys({
//         email: Joi.string()
//           .required()
//           .email({ tlds: { allow: false } }),
//         password: Joi.string().required(),
//       })
//       .unknown(false),
//   }),
//   login,
// );
// router.post(
//   '/signup',
//   celebrate({
//     body: Joi.object()
//       .keys({
//         email: Joi.string()
//           .required()
//           .email({ tlds: { allow: false } }),
//         password: Joi.string().required(),
//         about: Joi.string().min(2).max(30),
//         name: Joi.string().min(2).max(30),
//         avatar: Joi.string().custom(validateUrl, 'custom validate url'),
//       })
//       .unknown(false),
//   }),
//   createUser
// );

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use((req, res, next) => {
  next(new PAGE_NOT_FOUND("Вы обращаетесь по несуществующему Роуту"));
});
module.exports = router;
