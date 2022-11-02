require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFoundError = require('./errors/notFoundError');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

// remove this code after passing the review!
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// app.use(auth);

app.use('/', userRouter);
app.use('/', auth, cardRouter);

// 1. Instead of returning the response directly,
// it should throw the corresponding exception.
// app.use((req, res) => {
//   res.status(404).send({ message: 'Requested resource not found app.js' });
// });

// 2.  Returns a default error with 500 status code instead of 404
// app.use('*', NotFoundError);

// 3.
app.use('*', function(req, res){
  res.send(NotFoundError);
});

app.use(errorLogger);

// celebrate error handler
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
