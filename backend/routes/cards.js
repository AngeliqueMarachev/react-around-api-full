const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(1).max(30),
        link: Joi.string().uri().required(),
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