const bcrypt = require('bcryptjs');
const User = require("../models/users");
const jwt = require("jsonwebtoken");

// const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require("../errors/notFoundError");
const BadRequestError = require("../errors/badRequest");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError("No users to display");
      }
      return res.status(200).send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)

    .then((selectedUser) => {
      if (!selectedUser) {
        throw new NotFoundError("No user with matching ID");
      }
      return res.status(200).send(selectedUser);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Bad request");
      }
      next(err);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((password) =>
      User.create({
        email,
        password,
      })
    )
    .then((user) => {
      if (!user) {
        throw new BadRequestError("Bad request");
      }
      res.status(200).send({ message: "User created successfully" });
      //send({ data: { name: user.name, email: user.email, about: user.about, avatar: user.avatar },
    })
    .catch(next);
};

const updateUserData = (req, res) => {
  const id = req.user._id;
  const { body } = req;

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError("No user with ID found");
      }
      res
        .status(200)
        .send({ message: `User ${updatedUser} updated successfully` });
    })
    .catch(next);
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    throw new NotFoundError("Please update these fields");
  }
  return updateUserData(req, res);
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new NotFoundError("Please update avatar");
  }
  return updateUserData(req, res);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new BadRequestError("Bad request");
      }
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret,",
        { expiresIn: "7d" }
      );
      res.status(200).send(token);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new BadRequestError("Bad request");
      }
      return res.send(200).send({ data: user })
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
