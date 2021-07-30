const router = require('express').Router();

// создание и логин пользователя
router.use('/', require('./login'));

// аутентификация
router.use(require('../middlewares/auth'));

// роуты
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

module.exports = router;
