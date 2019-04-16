const express = require('express');
const { Genre, validate } = require('../models/genre');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const _ = require('lodash');

const router = express.Router();

router.get("/", async function(req, res){
	
	const genres = await Genre.find();

	return res.status(200).send(genres);
});

router.get("/:id", async function(req, res){
	
	const genre = await Genre.findById(req.params.id);
	
	if(!genre)return res.status(404).send("The genre with the given id was not found");
	
	return res.status(200).send(genre);	
});

router.post("/", auth, async function(req, res){
	
	const { error } = validate(req.body);
	if(error)return res.status(400).send(error.details[0].message);

	const genre = new Genre({
		name: req.body.name
	});
	await genre.save();
	
	return res.status(200).send(genre);
	
});

router.put("/:id", auth, async function(req, res){

	const genreReqBody = _.pick(req.body,['name']);
	
	const { error } = validate(genreReqBody);
	if(error)return res.status(400).status(error.details[0].message);

	/* const genre = await Genre.findByIdAndUpdate(req.params.id, {
		name: req.body.name
	},{new: true}); */
	
	const genre = await Genre.findOneAndUpdate({_id: req.params.id}, genreReqBody, {new: true});

	if(!genre)return res.status(404).send("The genre with the given id was not found to update");
	
	return res.status(200).send(genre);
});

router.delete("/:id", [auth, admin], async function(req, res){
	
	const genre = await Genre.findByIdAndRemove(req.params.id);
	
	if(!genre)return res.status(404).status("The genre with the given id was not found");

	return res.status(200).send(genre);

});

module.exports = router;