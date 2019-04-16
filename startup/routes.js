const express = require('express');	
const cors = require('cors');
const customers = require("../routes/customers");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const errorHandler = require("../middlewares/error");
const config = require('config');
const logger = require('./logging');
const morgan = require('morgan');
const path = require("path");

module.exports = function(app){
	
	/*
	** origin: Access-Control-Allow-Origin
	** methods: Access-Control-Allow-Methods
	** allowedHeaders: Access-Control-Allow-Headers     - default Access-Control-Request-Headers
	** exposedHeaders: Access-Control-Expose-Headers
	** credentials: Access-Control-Allow-Credentials
	** maxAge: Access-Control-Max-Age
	** preflightContinue: 
	** optionsSuccessStatus: For successful OPTIONS requests choke on 204 status code
	*/
	const corsOptions = {
		exposedHeaders: [config.get('authHeader')]
	};
	app.use(morgan('dev',{stream: logger.stream }));// -> moved to logging.js
	app.use(cors(corsOptions));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname+'/../dist/AngularApp/')));

	app.use("/customers", customers);
	app.use("/genres", genres);
	app.use("/movies", movies);
	app.use("/rentals", rentals);
	app.use("/users", users);
	app.use("/auth", auth);

	app.use(errorHandler);
}