const Joi = require('joi');
const mongoose = require('mongoose');
const { movieSchemaLite } = require('./movie');
const { customerSchemaLite } = require('./customer');

const Schema = mongoose.Schema;

const rentalSchema = Schema({
	movie:{
		type: movieSchemaLite,
		required: true
	},
	customer:{
		type: customerSchemaLite,
		required: true
	},
	dateOut:{
		type: Date,
		default: Date.now,
		required: true
	},
	dateReturned:{
		type:Date
	}
});

const rentalJoiSchema = {
	movieId: Joi.objectId().required(),
	customerId: Joi.objectId().required(),
};

const RentalModel = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
	return Joi.validate(rental, rentalJoiSchema);
}

module.exports.Rental = RentalModel;
module.exports.validate = validateRental;