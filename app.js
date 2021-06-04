// подключение фреймворка express
const express = require('express');

// подключение ORM mongoose
const mongoose = require('mongoose');

// создание приложения express
const app = express();

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

// FIXME: потом убрать
// тест сервера
app.get('/', (req, res) => res.send('OK'));

// обработка ошибок
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
