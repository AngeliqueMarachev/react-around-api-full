const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { validateURL } = require('../middleware/linkValidation');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:userId", getUser);

router.get(
  "/users/me",
  celebrate({
    body: Joi.object()
      .keys({
        user: Joi.object()
          .keys({
            _id: Joi.string().alphanum().required(),
          })
          .unknown(true),
      })
      .unknown(true),
  }),
  getCurrentUser
);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object()
      .keys({
        user: Joi.object()
          .keys({
            _id: Joi.string().alphanum().required(),
          })
          .unknown(true),
        name: Joi.string().min(2).max(40),
        about: Joi.string().min(2).max(200),
      })
      .unknown(true),
  }),
  updateUser
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object()
      .keys({
        user: Joi.object()
          .keys({
            _id: Joi.string().alphanum().required(),
          })
          .unknown(true),
        link: Joi.string().required().custom(validateURL),
      })
      .unknown(true),
  }),
  updateAvatar
);

module.exports = router;
