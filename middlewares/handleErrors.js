const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
} = require('../errors');

const handleErrors = () => {
  if (err.message === 'NotFound') {
    return res.status(PAGE_NOT_FOUND).send({ message: 'Not Found' });
  }
  if (err.name === 'CastError') {
    return res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
  }
  return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
};

module.exports = handleErrors;
