const winston = require('winston');
const mongoose = require('mongoose');
const Fawn = require('fawn');

module.exports = function(){

	mongooseOptions = {
		'useFindAndModify': false,
		'useCreateIndex': true
	};
	
	schemaOptions = {
		'bufferCommands': true,
		'id': true,
		'_id':true,
		'minimize': false,
		'strict': true
	}

	Fawn.init(mongoose,"TransactionDocument");

	//@host @Port @Database
	mongoose.connect("mongodb://localhost:27017/vidly")
		.then(() => {
			winston.info("Connected to MongoDB");
		});
}