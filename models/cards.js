const mongoose = require('mongoose');
const validator = require("validator");

const cardSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isUrl(link),
      message: "is not a valid link",
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
    ref: "user",
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
