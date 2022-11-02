const bcrypt = require('bcryptjs'); // for hashing password
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequest');
const NoAuthError = require('../errors/noAuthError');
const DuplicateKeyError = require('../errors/duplicateKeyError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('No users to display');
      }
      return res.status(200).send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('No user with matching ID');
    })
    .then((selectedUser) => res.status(200).send(selectedUser))
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  // set up a user in database by making server request
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DuplicateKeyError("The user with the provided email already exists");
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({
      email,
      password: hash,
    }))
    .then((user) => {
      const { password, ...userObj } = user.toObject()
      res.status(201).send(userObj);
      })
    .catch((err) => {
      next(err);
    });
}; //  CreateUser gets passed to OnRegister in App.js

const updateUserData = (req, res, next) => {
  const id = req.user._id;
  const { body } = req;

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError('No user with ID found');
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    throw new BadRequestError('Please update these fields');
  }
  return updateUserData(req, res);
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new BadRequestError('Please update avatar');
  }
  return updateUserData(req, res);
};

const { JWT_SECRET = 'secret-code' } = process.env;

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new NoAuthError('Incorrect email or password'));
      // If the user from userSchema isn't found, catch is triggered
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Requested resource not found');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
