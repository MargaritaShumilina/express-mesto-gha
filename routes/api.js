const apiRouter = require('express').Router();
const {
  login,
  createUser,
} = require('../controllers/api');

apiRouter.post('/signin', login);
apiRouter.post('/signup', createUser);

module.exports = apiRouter;
