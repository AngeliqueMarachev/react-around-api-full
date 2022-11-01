/* eslint-disable indent */
const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middleware/linkValidation');
const auth = require('../middleware/auth');

const {
  login,
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const authValidation = Joi.object()
  .keys({
    authorization: Joi.string().required(),
  })
  .unknown(true);

const userIdValidation = Joi.object().keys({
  userId: Joi.string().hex().length(24),
});

function validateEmail(string) {
  if (!validator.isEmail(string)) {
    throw new Error('Invalid Email');
  }
  return string;
}

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().custom(validateEmail),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().custom(validateEmail),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser,
);

router.get(
  '/users/me',
  celebrate({
    headers: authValidation,
  }),
  auth,
  getCurrentUser,
);

router.get(
  '/users',
  celebrate({
    headers: authValidation,
  }),
  auth,
  getUsers,
);

router.get(
  '/users/:userId',
  celebrate({
    params: userIdValidation,
    headers: authValidation,
  }),
  auth,
  getUser,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(40),
      about: Joi.string().required().min(2).max(200),
    }),
    headers: authValidation,
  }),
  auth,
  updateUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
    headers: authValidation,
  }),
  auth,
  updateAvatar,
);

module.exports = router;
