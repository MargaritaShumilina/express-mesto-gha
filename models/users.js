const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validator(v) {
        return /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._[\]+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_[\]+.~#?&?[\]/=]*)/g.test(v);
      },
      message: 'url is not valid',
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          validator.isEmail(email);
        },
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } },
);

module.exports = mongoose.model('user', userSchema);
