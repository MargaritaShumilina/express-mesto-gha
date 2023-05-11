const router = require('express').Router();
const cardRouter = require('./cards');
const userRouter = require('./users');
const apiRouter = require('./api');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('/api', apiRouter);

module.exports = router;
