/* eslint-disable indent */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
    res.status(401).send({ message: 'Authorization Error' });
};

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return handleAuthError(res);
    }
    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
        // console.log('token', token);
        // console.log('secret', JWT_SECRET);
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.log(err);
        return handleAuthError(res);
    }

    req.user = payload;
    return next();
};

module.exports = auth;
