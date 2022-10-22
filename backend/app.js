const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
// const { createUser, login } = require('./controllers/users')
const auth = require('./middleware/auth');
const { errorHandler } = require("./middleware/errorHandler");
const { requestLogger, errorLogger } = require('./middleware/logger');
require('dotenv').config();

// console.log(process.env.NODE_ENV);

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/aroundb');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(requestLogger);

// app.use(auth);

app.use('/', userRouter);
app.use('/', auth, cardRouter);

app.use((req, res) => {
    res.status(404).send({ message: 'Requested resource not found app.js' });
});

app.use(errorLogger);

// celebrate error handler
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
