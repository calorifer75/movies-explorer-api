const jwt = require('jsonwebtoken');
const LoginError = require('../errors/login-err');
const config = require('../config/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const loginError = new LoginError('Ошибка! Необходима авторизация');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw loginError;
  }

  const token = authorization.replace('Bearer ', '');
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : config.JWT_SECRET,
    );
  } catch (error) {
    next(error);
    return;
  }

  req.user = payload;
  next();
};
