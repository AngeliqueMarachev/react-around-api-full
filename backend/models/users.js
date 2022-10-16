const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
   default: 'Explorer'
  },
  avatar: {
    type: String,
   default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'Invalid URL',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
