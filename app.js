// подключение фреймворка express
const express = require('express');

// подключение безопасника helmet
const helmet = require('helmet');

// подключение валидатора Joi
const { celebrate, Joi, errors: celebrateErrors } = require('celebrate');

// подключение ORM mongoose
const mongoose = require('mongoose');

// подключение CORS
const cors = require('cors');

// подключение классов ошибок
const NotFoundError = require('./errors/not-found-err');

// подключение методов из контроллера users
const { createUser, login } = require('./controllers/users');

// подключение логгеров
const { requestLogger, errorLogger } = require('./middlewares/logger');

// подключение файла .env
require('dotenv').config();

// ////////////////////////////////////////////////////////////////////

// создание приложения express
const app = express();

// использование безопасника helmet
app.use(helmet());

// использование распознавания JSON в теле запроса
app.use(express.json());

// использование распознавания строк и массивов в теле запроса
app.use(express.urlencoded({ extended: true }));

// использование CORS
app.use(cors());

// использование логгера запросов
app.use(requestLogger);

// подключение к базе данных
mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    throw new Error(err);
  });

// создание нового пользователя
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

// логин
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

// аутентификация
app.use(require('./middlewares/auth'));

// роуты
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

// обработка ошибки 404
app.use((req, res, next) => next(new NotFoundError('Ошибка 404. Страница не найдена')));

// использование логгера ошибок
app.use(errorLogger);

// обработка ошибок celebrate
app.use(celebrateErrors());

// обработка прочих ошибок сервера
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка: ${message}`
        : message,
    });

  next();
});

// запуск приложения на порту 3000
app.listen(3000);
