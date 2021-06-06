const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UniqueValueError = require('../errors/unique-value-err');
const LoginError = require('../errors/login-err');

// создание нового пользователя
module.exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, name, password: hash });
    const jsonUser = user.toJSON();
    delete jsonUser.password;
    res.send(jsonUser);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new UniqueValueError('Ошибка! Такой пользователь уже есть'));
    } else {
      next(error);
    }
  }
};

// логин
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const loginError = new LoginError('Ошибка! Неправильные почти и пароль');

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw loginError;

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw loginError;

    const { NODE_ENV, JWT_SECRET } = process.env;
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'very-strong-secret',
      { expiresIn: '7d' },
    );

    res.send(token);
  } catch (error) {
    next(error);
  }
};
