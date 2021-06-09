const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');

// создание нового фильма
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().integer().min(1900).max(9999),
      description: Joi.string().required(),
      image: Joi.string().required()
        .custom((value) => {
          if (validator.isURL(value, { require_protocol: true })) return value;
          throw new Error('image is not valid URL');
        }),
      trailer: Joi.string().required()
        .custom((value) => {
          if (validator.isURL(value, { require_protocol: true })) return value;
          throw new Error('trailer is not valid URL');
        }),
      thumbnail: Joi.string().required()
        .custom((value) => {
          if (validator.isURL(value, { require_protocol: true })) return value;
          throw new Error('image is not valid URL');
        }),
      movieId: Joi.string().length(24).hex().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

// получение всех фильмов текущего пользователя
router.get('/', getMovies);

// удаление фильма по id
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
