const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');

const router = express.Router();

router.get("/:id", async function(req, res){
	
	const rental = await Rental.findById(req.params.id);
	
	if(!rental) return res.status(400).send("Rental with the given id was not found");
	
	return res.status(200).send(rental);
	
});

router.get("/", async function(req, res){

	const rental = await Rental.find();
	
	return res.status(200).send(rental);

});

router.post("/", auth, async function(req, res){

	const { error } = validate(req.body);

	if(error)return res.status(400).send(error.details[0].message);
	
	const customer = await Customer.findById(req.body.customerId);
	if(!customer) return res.send("Customer with the given id was not found");
	
	const movie = await Movie.findById(req.body.movieId);
	if(!movie) return res.send("Movie with the given id was not found");
	
	if(movie.numberInStock === 0)return res.status(400).send("Movie out of stock");
	
	const rental = new Rental({
		customer:{
			_id: customer._id,
			name: customer.name,
			phone: customer.phone
		},
		movie:{
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate
		}
	});
	
	const task = Fawn.Task();

	task.save("Rental", rental)
		.update("Movie", {_id: movie._id }, {$inc:{numberInStock:-1}})
		.run({useMongoose: true})
		.then(function(){
			return res.status(200).send(rental);
		})
		.catch(function(err){
			return res.status(500).send(err);
		});
});

router.delete("/:id", [auth, admin], async function(req, res){
	
	const rental = await Rental.findByIdAndRemove(req.params.id);
	
	if(!rental) return res.status(400).send("Rental with the given id was not found");
	
	return res.status(200).send(rental);

});


module.exports = router;