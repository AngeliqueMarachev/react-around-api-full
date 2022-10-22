// module.exports.errorHandler = (err, req, res, next) => {
//   const { statusCode = 500, message } = err;
//   res.status(statusCode).send({
//     message: statusCode === 500 ? 'An error occurred on the server' : message,
//   });
//   next();
// };

module.exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "An error occurred on the server" : err.message;
  res.status(statusCode).send({ message });
  next();
};

