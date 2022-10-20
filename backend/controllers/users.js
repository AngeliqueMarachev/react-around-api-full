const bcrypt = require('bcryptjs'); // for hashing password
const User = require('../models/users');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequest');

const getUsers = (req, res, next) => {
    User.find({})
        .then((users) => {
            if (!users) {
                throw new NotFoundError('No users to display');
            }
            return res.status(200).send({ data: users });
        })
        .catch(next);
};

// const getUser = (req, res, next) => {
//     const { userId } = req.params;
//     User.findById(userId)

//         .then((selectedUser) => {
//             if (!selectedUser) {
//                 throw new NotFoundError('No user with matching ID');
//             }
//             return res.status(200).send(selectedUser);
//         })
//         .catch((err) => {
//             if (err.name === 'CastError') {
//                 throw new BadRequestError('Bad request');
//             }
//             next(err);
//         })
//         .catch(next);
// };

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {throw new NotFoundError("No user with matching ID")})
    .then((selectedUser) => res.status(200).send(selectedUser))
    .catch(next);
};

const createUser = (req, res, next) => {
    // set up a user in database by making server request
    const { email, password } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (user) {
                throw new BadRequestError(
                    'The user with the provided email already exists',
                );
            } else {
                return bcrypt.hash(password, 10);
            }
        })
        .then((hash) =>
            User.create({
                email,
                password: hash,
            }),
        )
        .then((data) => res.status(201).send(data))
        .catch((err) => {
            console.log('error here', err);
        });
}; //  CreateUser gets passed to OnRegister in App.js

const updateUserData = (req, res) => {
    const id = req.user._id;
    const { body } = req;

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                throw new NotFoundError('No user with ID found');
            }
            res.status(200).send({
                message: `User ${updatedUser} updated successfully`,
            });
        })
        .catch(next);
};

const updateUser = (req, res) => {
    const { name, about } = req.body;

    if (!name || !about) {
        throw new NotFoundError('Please update these fields');
    }
    return updateUserData(req, res);
};

const updateAvatar = (req, res) => {
    const { avatar } = req.body;

    if (!avatar) {
        throw new NotFoundError('Please update avatar');
    }
    return updateUserData(req, res);
};

const { JWT_SECRET } = process.env;

const login = (req, res) => {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
                expiresIn: '7d',
            });
            res.send({ user, token }); // HERE?
        })
        .catch((err) => {
            // console.log(err);
            res.status(401).send(err); // If the user from userSchema isn't found, catch is triggered
        });
};

const getCurrentUser = (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => {
            if (!user) {
                throw new BadRequestError('Bad request');
            }
            return res.send(200).send({ data: user });
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
