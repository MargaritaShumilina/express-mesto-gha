const router = require('express').Router();
const cardRouter = require('./cards');
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/api');

router.use('/users', auth, userRouter);
router.use('/cards', cardRouter);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
