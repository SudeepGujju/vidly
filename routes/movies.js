const express = require('express');
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();

/* Routes */
router.get("/:id", async function(req, res){
	
	const movie = await Movie.findById(req.params.id);

	if(!movie)return res.status(404).send("The movie with the given ID was not found.");

});

router.get("/", async function(req, res){

	const movies = await Movie.find();

	return res.status(200).send(movies);
});

router.post("/", auth, async function(req, res){

	const { error } = validate(req.body);

	if(error)return res.status(400).send(error.details[0].message);
	
	const genre = await Genre.findById(req.body.genreId);

	if(!genre)return res.status(400).send("Invalid Genre");

	const movie = new Movie({
		title: req.body.title,
		genre: {
			_id:genre._id,
			name: genre.name
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate
	});

	await movie.save();
	
	return res.status(200).send(movie);

});

router.put("/:id", auth, async function(req, res){
	
	const { error } = validate(req.body);

	if(error)return res.status(400).send(error.details[0].message);
	
	const genre = await Genre.findById(req.body.genreId);

	if(!genre)return res.status(400).send("Invalid Genre");
	
	const movie = Movie.findByIdAndUpdate(req.params.id,{
		title: req.body.title,
		genre: {
			_id:genre._id,
			name: genre.name
		},
		numberInStock: numberInStock,
		dailyRentalRate: dailyRentalRate
	},{new: true});

	if(!movie)return res.status(404).send("The movie with the given ID was not found.");

	return res.status(200).send(movie);
});

router.delete("/:id", [auth, admin], async function(req, res){

	const movie = await Movie.findById(req.params.id);

	if(!movie)return res.status(404).send("The movie with the given ID was not found.");

	return res.status(200).send(movie);
});
/* #Comment
createMovie({title: "Mission Impossible", genreId: "5c445755031cc12c8474adb0", numberInStock: 5, dailyRentalRate: 10});
createMovie({title: "Interstellar", genreId: "5c445755031cc12c8474adb5", numberInStock: 15, dailyRentalRate: 20});
*/

module.exports = router;