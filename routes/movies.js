const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const router = express.Router();
const multer = require("multer");
const upload = require("../utils/upload")(multer);
//const fs = require("fs");
const { getFile, removeFile } = require("../utils/file");

/* Routes */
router.get("/:id", async function(req, res) {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  const movieJSON = movie.toJSON({ virtuals: true });

  getFile(movie.coverPic._id)
    .then(data => {
      movieJSON.coverPic = data.fileName;
      //movieJSON.coverPicID = data.fileID;
      res.status(200).send(movieJSON);
    })
    .catch(err => {
      movieJSON.coverPic = null;
      //movieJSON.coverPicID = null;
      res.status(200).send(movieJSON);
    });

  return;
});

router.get("/", async function(req, res) {
  const movies = await Movie.find().sort('title');

  return res.status(200).send(movies);
});

router.post("/", auth, upload.single("coverPic"), async function(req, res) {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) return res.status(400).send("Invalid Genre");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    coverPic: {
      _id: ( req.file ? req.file.id : null)
    }
  });

  await movie.save();

  return res.status(200).send(movie);
});

router.put("/:id", auth, upload.single("coverPic"), async function(req, res) {

  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findOne({ _id: req.body.genreId });

  if (!genre) return res.status(400).send("Invalid Genre");

  if(req.file.id && req.body.coverPicID)
  {
    await removeFile(req.body.coverPicID);
  }

  const movie = await Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      coverPic: {
        _id: ( req.file ? req.file.id : null)
      }
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  return res.status(200).send(movie);
});

router.delete("/:id", [auth, admin], async function(req, res) {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  return res.status(200).send(movie);
});

module.exports = router;

/* #Comment
createMovie({title: "Mission Impossible", genreId: "5c445755031cc12c8474adb0", numberInStock: 5, dailyRentalRate: 10});
createMovie({title: "Interstellar", genreId: "5c445755031cc12c8474adb5", numberInStock: 15, dailyRentalRate: 20});
*/

// console.log(req.body);

// const file = fs.readFileSync(req.file.path); //.toString("base64");

// coverPic: {
//   data: fs.readFileSync(req.file.path),
//   contentType: req.file.mimetype
// }

// const filename = "" + Date.now() + ".png";
// let wr = fs.createWriteStream("../uploads/" + filename);
// wr.write(new Buffer(movie.coverPic.data, "base64").toString("base64"));
// wr.end();

// movie.coverPic = "/uploads/" + filename;