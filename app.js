// подключение фреймворка express
const express = require('express');

// подключение безопасника helmet
const helmet = require('helmet');

// подключение валидатора Joi
const { errors: celebrateErrors } = require('celebrate');

// подключение ORM mongoose
const mongoose = require('mongoose');

// подключение CORS
const cors = require('cors');

// подключение логгеров
const { requestLogger, errorLogger } = require('./middlewares/logger');

// подключение файла .env
require('dotenv').config();

// подключение всего остального
const config = require('./config/config');
const constants = require('./config/constants');

// ////////////////////////////////////////////////////////////////////

// создание приложения express
const app = express();

// использование безопасника helmet
// обратите внимание пожалуйста, helmet ИСПОЛЬЗУЕТСЯ (он и раньше использовался)
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
const { NODE_ENV, MONGO_BASE } = process.env;
const database = NODE_ENV === 'production'
  ? MONGO_BASE
  : config.MONGO_BASE;
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    throw new Error(err);
  });

// rate limiter
app.use(require('./middlewares/rate-limiter'));

// роуты
app.use(require('./routes/index'));

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
        ? constants.internalServerErrorMsg + message
        : message,
    });

  next();
});

// запуск приложения на порту 3000
app.listen(3000);
