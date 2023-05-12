const {
  PAGE_NOT_FOUND,
  BAD_REQUEST,
} = require('../errors');

const handleErrors = (err, next) => {
  if (err.message === 'NotFound') {
    return next(new PAGE_NOT_FOUND({ message: 'Not Found' }));
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return next(new BAD_REQUEST({ message: 'Ошибка данных' }));
  }
  next(err);
};

module.exports = handleErrors;
