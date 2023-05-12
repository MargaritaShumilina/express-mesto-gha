const apiRouter = require('express').Router();
const { errors, celebrate, Joi } = require("celebrate");
const {
  login,
  createUser,
} = require('../controllers/api');

apiRouter.post('/signin', login);
apiRouter.post('/signup', createUser);

module.exports = apiRouter;
