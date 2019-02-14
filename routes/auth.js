const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

router.post("/", async function(req, res){

	const { error } = validate(req.body);

	if(error)return res.status(400).send(error.details[0].message);
	
	const user = await User.findOne({ email: req.body.email});
	if(!user)return res.status(400).send("Invalid email or password");

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if(!isValid)return res.status(400).send("Invalid email or password");
	
	const token = user.generateAuthToken();

	return res.header('x-auth-token', token).status(200).send(_.pick(user, ['_id','name','email']));

});

const userJoiSchema = {
	email: Joi.string().min(7).max(255).required().email(),
	password: Joi.string().min(8).max(15).required()
}

function validate(user){
	return Joi.validate(user, userJoiSchema);
}

module.exports = router;