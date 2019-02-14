const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name:{
		type: String,
		minlength: 5,
		maxlength: 50,
		required: true
	},
	email:{
		type: String,
		minlength: 7,
		maxlength: 255,
		required: true,
		unique: true
	},
	password:{
		type: String,
		minlength: 8,
		maxlength: 1024,/*Maximum 15 without Hashing Password*/
		required: true
	},
	phone:{
		type: String,
		maxlength: 15
	},
	isActive:{
		type: Boolean,
		default: true,
	},
	isAdmin:{
		type: Boolean,
		default: false,
	}
});

userSchema.methods.generateAuthToken = function(){
	return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtSecretKey'));
}

const userJoiSchema = {
	name: Joi.string().min(5).max(50).required(),
	email: Joi.string().min(7).max(255).required().email(),
	password: Joi.string().min(8).max(15).required(),
	phone: Joi.string().max(15)
}

const UserModel = mongoose.model('User', userSchema);

function validateUser(user){
	return Joi.validate(user, userJoiSchema);
}

module.exports.validate = validateUser;
module.exports.User = UserModel;