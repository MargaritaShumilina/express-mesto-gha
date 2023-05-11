// const auth = require('../middlewares/auth');

const userRouter = require('express').Router();
const {
  getFiltredUser,
  getUsers,
  updateUserData,
  updateUserAvatar,
  getMyProfile,
} = require('../controllers/users');

// userRouter.post('/', createUser);
// userRouter.post('/signin', login);
// userRouter.post('/signup', createUser);
userRouter.get('/', getUsers);
userRouter.get('/me', getMyProfile);
userRouter.get('/:id', getFiltredUser);
userRouter.patch('/me', updateUserData);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
