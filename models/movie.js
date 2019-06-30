const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
//Joi.objectId = require('joi-objectid')(Joi);

const Schema = mongoose.Schema;

/* Schemas */
const movieSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 255,
      required: true
    },
    genre: {
      type: genreSchema,
      required: true
    },
    numberInStock: {
      type: Number,
      min: 0,
      max: 255,
      required: true
    },
    dailyRentalRate: {
      type: Number,
      min: 0,
      max: 255,
      required: true
    },
    coverPic: {
      // data: Buffer,
      // contentType: String
      _id: {
        type: Schema.Types.ObjectId,
        alias: 'coverPicID'
      }
    }
  },
  {
    collection: config.Collections.Movie
  }
);

const movieSchemaLite = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  }
});

const movieJoiSchema = {
  title: Joi.string()
    .min(5)
    .max(255)
    .required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number()
    .integer()
    .min(0)
    .max(255)
    .required(),
  dailyRentalRate: Joi.number()
    .integer()
    .min(0)
    .max(255)
    .required(),
  coverPicID: [Joi.allow(null), Joi.objectId()]
};

/* Models */
const MovieModel = mongoose.model(config.get('Collections.Movie'), movieSchema);

function validateMovie(movie) {
  return Joi.validate(movie, movieJoiSchema, config.get('JoiSchemaOptions'));
}

module.exports.movieSchemaLite = movieSchemaLite;
module.exports.Movie = MovieModel;
module.exports.validate = validateMovie;
