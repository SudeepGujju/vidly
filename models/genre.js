const config = require("config");
const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* Genre -> Begin */

/* Schemas */
const genreSchema = new Schema({
	name:{
		type: String,
		minlength: 5,
		maxlength: 50,
		required: true,
		unique: true
	}
});

const genreJoiSchema = {
	name: Joi.string().min(5).max(50).required()
};

/* Models */
const GenreModel = new mongoose.model(config.get('Collections.Genre'), genreSchema);

function validateGenre(genre){
	return Joi.validate(genre, genreJoiSchema, config.get('JoiSchemaOptions'));
}

module.exports.validate = validateGenre;
module.exports.Genre	= GenreModel;
module.exports.genreSchema = genreSchema;

/* #Comment
createGenre("Action");
createGenre("Comedy");
createGenre("Crime");
createGenre("Horror");
createGenre("Romance");
createGenre("Science fiction");
createGenre("Thriller");
*/

/* #Testing - end */

/* Genre -> End */