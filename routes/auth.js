const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const config = require('config');

const router = express.Router();

router.post("/", async function(req, res){

	const { error } = validate(req.body);

	if(error)return res.status(400).send(error.details[0].message);
	
	const user = await User.findOne({ email: req.body.email});
	if(!user)return res.status(400).send("Invalid email or password");

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if(!isValid)return res.status(400).send("Invalid email or password");
	
	const token = user.generateAuthToken();

	return res.header(config.get('authHeader'), token).status(200).send(_.pick(user, ['_id','name','email']));

});

const userJoiSchema = {
	email: Joi.string().required().email(),//.min(7).max(255).
	password: Joi.string().required()//min(8).max(15).
}

function validate(user){
	return Joi.validate(user, userJoiSchema);
}

module.exports = router;