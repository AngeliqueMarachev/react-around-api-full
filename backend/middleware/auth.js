const jwt = require("jsonwebtoken");

const handleAuthError = (res) => {
  res
    .status(401)
    .send({  message: "Authorization Error" });
};

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  // const token = authorization.replace("Bearer ", "");
  // let payload;

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  next();
};
