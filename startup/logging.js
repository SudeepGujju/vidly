const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function(){

	winston.add(winston.transports.File,{ filename: './logs/something.log'});
	winston.add(winston.transports.MongoDB,{ db: 'mongodb://localhost:27017'});

	winston.handleExceptions(
		new winston.transports.File({ filename: './logs/uncaughtExceptions.log' }));

	process.on('unhandledRejection', function(ex){
		throw ex;
	});

	/*
	process.on('uncaughtException', function(err){
		winston.error(err.message, err);
		process.exit(1);
		return false;
	});

	process.on('unhandledRejection', function(err){
		winston.error(err.message, err);
		process.exit(1);
		return false;
	});
	*/

}