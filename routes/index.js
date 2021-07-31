const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const constants = require('../config/constants');

// создание и логин пользователя
router.use('/', require('./login'));

// аутентификация
router.use(require('../middlewares/auth'));

// роуты
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

// обработка ошибки 404
router.use((req, res, next) => next(new NotFoundError(constants.pageNotFoundErrorMsg)));

module.exports = router;
