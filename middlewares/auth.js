const jwt = require('jsonwebtoken');
const LoginError = require('../errors/login-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const loginError = new LoginError('Ошибка! Необходима авторизация');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw loginError;
  }

  const token = authorization.replace('Bearer ', '');
  const { NODE_ENV, JWT_SECRET } = process.env;
  let userId;

  try {
    userId = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'very-strong-secret',
    );
  } catch (error) {
    next(error);
    return;
  }

  req.user = userId;
  next();
};
