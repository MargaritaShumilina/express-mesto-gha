const mongoose = require('mongoose');
const regularExp = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regularExp.test(v),
      message: 'Невалидная ссылка',
    },
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
