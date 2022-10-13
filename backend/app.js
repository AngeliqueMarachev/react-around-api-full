const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { createUser, login } = require('./controllers/users')
const auth = require('./middleware/auth');
require('dotenv').config();

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { PAGE_ERROR } = require('./utils/constants');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

// app.use((req, res, next) => {
//   req.user = {
//     _id: '631ae2f2cb10f131ef1f3f31',
//   };

//   next();
// });

app.use(auth);

app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use((req, res) => {
  res.status(PAGE_ERROR).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
