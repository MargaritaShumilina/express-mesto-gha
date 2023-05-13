const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { errors, Joi, celebrate } = require('celebrate');

const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} = require('./errors');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use(auth, (_req, _res, next) =>
  next(new PAGE_NOT_FOUND('Страница не найдена')));
// app.use('*', auth, (req, res, next) =>
//   next(new PAGE_NOT_FOUND('Page Not Found')),
// );
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
