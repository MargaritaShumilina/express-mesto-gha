const router = require('express').Router();
const cardRouter = require('./cards');
const userRouter = require('./users');
// const apiRouter = require('./api');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/api');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
