const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const NoAuthError = require('../errors/noAuthError');

const { JWT_SECRET = 'secret-code' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NoAuthError('You are not authorized to perform this action'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NoAuthError('You are not authorized to perform this action'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
