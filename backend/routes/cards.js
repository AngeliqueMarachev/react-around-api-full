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
const { custom } = require('joi');

router.get('/cards', getCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(1).max(30),
        link: Joi.string().required().custom(validateURL),
        user: Joi.object().keys({
          _id: Joi.string().alphanum().required(),
        }).unknown(true),
      })
      .unknown(true),
  }),
  createCard,
);

router.delete(
  '/cards/:cardId',
  celebrate({
    body: Joi.object().keys({
      user: Joi.object().keys({
        _id: Joi.string().alphanum().required(),
      }).unknown(true),
    }).unknown(true),
    params: Joi.object()
      .keys({
        cardId: Joi.string().alphanum().required(),
      })
      .unknown(true),
  }),
  deleteCard,
);

router.put(
    '/cards/:cardId/likes',
    celebrate({
      body: Joi.object().keys({
        user: Joi.object().keys({
          _id: Joi.string().alphanum().required(),
        }).unknown(true),
      }).unknown(true),
      params: Joi.object()
        .keys({
          cardId: Joi.string().alphanum().required(),
        })
        .unknown(true),
    }),
    likeCard,
  );

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    body: Joi.object().keys({
      user: Joi.object().keys({
        _id: Joi.string().alphanum().required(),
      }).unknown(true),
    }).unknown(true),
    params: Joi.object()
      .keys({
        cardId: Joi.string().alphanum().required(),
      })
      .unknown(true),
  }),
  dislikeCard,
);

module.exports = router;