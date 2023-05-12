const { errors, celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const userRouter = require('express').Router();

const {
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
  getMyProfile,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getMyProfile);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }).unknown(false),
}), getFiltredUser);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30).required(),
        about: Joi.string().min(2).max(30).required(),
      })
      .unknown(false),
  }),
  updateUserData,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object()
      .keys({
        avatar: Joi.string()
          .required(),
      })
      .unknown(false),
  }),
  updateUserAvatar,
);

router.use(errors());

module.exports = userRouter;
