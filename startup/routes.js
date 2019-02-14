const express = require('express');	
const cors = require('cors');
const customers = require("../routes/customers");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const errorHandler = require("../middlewares/error");

module.exports = function(app){
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use("/customers", customers);
	app.use("/genres", genres);
	app.use("/movies", movies);
	app.use("/rentals", rentals);
	app.use("/users", users);
	app.use("/auth", auth);

	app.use(errorHandler);
}