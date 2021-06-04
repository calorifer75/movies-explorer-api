const mongoose = require('mongoose');
const validator = require('validator');

// схема данных "Movie"
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    validate: {
      validator(v) {
        return (v >= 0 && v <= 9999);
      },
      message: (props) => `${props.value} is not a valid year!`,
    },
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v, { require_protocol: true });
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v, { require_protocol: true });
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v, { require_protocol: true });
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

// модель данных "Movie"
module.exports = mongoose.model('movie', movieSchema);
