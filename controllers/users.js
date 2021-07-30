const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UniqueValueError = require('../errors/unique-value-err');
const NotFoundError = require('../errors/not-found-err');
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
      next(new UniqueValueError('Ошибка! Пользователь с таким email уже есть'));
    } else {
      next(error);
    }
  }
};

// логин
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const loginError = new LoginError('Ошибка! Неправильные почта и пароль');

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

    res.send({ token });
  } catch (error) {
    next(error);
  }
};

// получение информации о пользователе
module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User
      .findById(req.user._id)
      .orFail(
        new NotFoundError('Ошибка! Нет пользователя с таким id'),
      );

    res.send(user.toJSON());
  } catch (error) {
    next(error);
  }
};

// изменение информации о пользователе
module.exports.setUserInfo = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    const user = await User
      .findByIdAndUpdate(
        req.user._id,
        { email, name },
        { runValidators: true, new: true },
      )
      .orFail(
        new NotFoundError('Ошибка! Нет пользователя с таким id'),
      );

    res.send(user.toJSON());
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new UniqueValueError('Ошибка! Пользователь с таким email уже есть'));
    } else {
      next(error);
    }
  }
};
