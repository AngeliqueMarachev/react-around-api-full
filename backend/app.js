const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { createUser, login } = require('./controllers/users')
const auth = require('./middleware/auth');
const { errorHandler } = require("./middleware/errorHandler");
require('dotenv').config();

console.log(process.env.NODE_ENV);

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(auth, userRouter);
app.use(auth, cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
