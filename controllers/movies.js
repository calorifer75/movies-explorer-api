const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const AccessViolationError = require('../errors/not-found-err');
const CastError = require('../errors/cast-err');
const constants = require('../config/constants');

// создание нового фильма
module.exports.createMovie = async (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailer, thumbnail,
    nameRU, nameEN, movieId,
  } = req.body;

  try {
    const movie = await Movie.create(
      {
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        thumbnail,
        nameRU,
        nameEN,
        movieId,
        owner: req.user._id,
      },
    );
    res.send(movie.toJSON());
  } catch (error) {
    next(error);
  }
};

// получение всех фильмов текущего пользователя
module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

// удаление фильма по id
module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId).orFail(
      new NotFoundError(constants.notFoundErrorMsg),
    );

    if (String(movie.owner) !== req.user._id) {
      throw new AccessViolationError(constants.accessViolationErrorMsg);
    }

    res.send(await Movie.findByIdAndRemove(movieId).orFail(
      new NotFoundError(constants.notFoundErrorMsg),
    ));
  } catch (error) {
    if (error.name === 'CastError') {
      next(
        new CastError(constants.castErrorMsg + error.message),
      );
    } else next(error);
  }
};
