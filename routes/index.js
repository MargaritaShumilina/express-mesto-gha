const router = require('express').Router();
const cardRouter = require('./cards');
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const {
  PAGE_NOT_FOUND,
} = require('../errors');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use((req, res, next) => {
  next(new PAGE_NOT_FOUND('Not Found'));
});
module.exports = router;
