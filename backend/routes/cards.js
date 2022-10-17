const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middleware/linkValidation');


const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const newCardValidation = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().custom(validateURL),
});

const authValidation = Joi.object()
  .keys({
    authorization: Joi.string().required(),
  })
  .unknown(true);

const cardIdValidation = Joi.object().keys({
  cardId: Joi.string().hex().length(24),
});

router.get(
  '/cards',
  celebrate({
    headers: authValidation,
  }),
  getCards);

router.post(
  '/cards',
  celebrate({
    body: newCardValidation,
    headers: authValidation,
  }),
  createCard,
);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: cardIdValidation,
    headers: authValidation,
  }),
  deleteCard,
);

router.put(
    '/cards/:cardId/likes',
    celebrate({
      params: cardIdValidation,
      headers: authValidation,
    }),
    likeCard,
  );

router.delete(
  '/cards/:cardId/likes',
  celebrate({
      params: cardIdValidation,
      headers: authValidation,
  }),
  dislikeCard,
);

module.exports = router;