const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

// подключение методов из контроллера users
const { createUser, login } = require('../controllers/users');

// создание нового пользователя
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

// логин
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

module.exports = router;
