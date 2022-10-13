const bcrypt = require("bcryptjs");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const {
  SERVER_ERROR,
  INVALID_DATA,
  PAGE_ERROR,
} = require("../utils/constants");

const getUsers = (req, res) => {
  User.find({}) // no specific prompt
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => SERVER_ERROR(res));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.status = PAGE_ERROR;
      throw error;
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid user" });
      } else if (err.status === PAGE_ERROR) {
        res.status(PAGE_ERROR).send({ message: err.message });
      } else {
        SERVER_ERROR(res);
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  // User.create({ name, about, avatar, email, password })
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      } else {
        SERVER_ERROR(res);
      }
    });
};

const updateUserData = (req, res) => {
  const id = req.user._id;
  const { body } = req;

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error("User id not found");
      error.status = PAGE_ERROR;

      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "User id is incorrect" });
      } else if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: "Bad request" });
      } else if (err.status === PAGE_ERROR) {
        res.status(PAGE_ERROR).send({ message: err.message });
      } else {
        SERVER_ERROR(res);
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    return res
      .status(INVALID_DATA)
      .send({ message: "Please update these fields" });
  }
  return updateUserData(req, res);
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(INVALID_DATA).send({ message: "Please update avatar" });
  }
  return updateUserData(req, res);
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
