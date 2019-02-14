const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/* Schemas */
const customerSchema = Schema({
	name:{
		type: String,
		minlength: 5,
		maxlength: 255,
		required: true
	},
	isGold:{
		type: Boolean,
		default: false
	},
	phone:{
		type: String,
		minlength: 10,
		maxlength: 10,
		required: true
	}
});

const customerSchemaLite = Schema({
	name:{
		type: String,
		minlength: 5,
		maxlength: 255,
		required: true
	},
	phone:{
		type: String,
		minlength: 10,
		maxlength: 10,
		required: true
	}
});

const customerJoiSchema = {
	name: Joi.string().min(5).max(255).required(),
	isGold: Joi.boolean(),
	phone: Joi.string().min(10).max(10).required()
}

/* Models */
//@Customer -> Collection Name (Table)
const CustomerModel = mongoose.model("Customer",customerSchema);

function validateCustomer(customer){
	return Joi.validate(customer, customerJoiSchema);
}

module.exports.customerSchemaLite = customerSchemaLite;
module.exports.Customer = CustomerModel;
module.exports.validate = validateCustomer;