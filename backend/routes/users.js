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

const authValidation = Joi.object()
  .keys({
    authorization: Joi.string().required(),
  })
  .unknown(true);

const userIdValidation = Joi.object().keys({
  userId: Joi.string().hex().length(24),
});

router.get("/users",
celebrate({
  headers: authValidation,
}),
  getUsers);

router.get("/users/:userId",
celebrate({
  params: userIdValidation,
  headers: authValidation,
}),
  getUser);

router.get(
  "/users/me",
  celebrate({
    headers: authValidation,
  }),
  getCurrentUser
);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(40),
      about: Joi.string().required().min(2).max(200),
    }),
    headers: authValidation,
  }),
  updateUser
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
    headers: authValidation,
  }),
  updateAvatar
);

module.exports = router;
