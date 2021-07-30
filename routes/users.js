const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, setUserInfo } = require('../controllers/users');

// получение информации о пользователе
router.get('/me', getUserInfo);

// изменение информации о пользователе
router.patch(
  '/me',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        name: Joi.string().required().min(2).max(30),
      }),
  }),
  setUserInfo,
);

module.exports = router;
