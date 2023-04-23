const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
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
