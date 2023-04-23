const userRouter = require('express').Router();
const {
  createUser,
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/:id', getFiltredUser);
userRouter.get('/', getUsers);
userRouter.patch('/me', updateUserData);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
