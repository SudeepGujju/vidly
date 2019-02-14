const { User, validate } = require('../models/user');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get("/me", async function(req, res){

	const user = await User.findById(req.user._id)
							.select('-password');
	
	return res.status(200).send(user);
});

router.post("/", async function(req, res){

	const { error } = validate(req.body);
	if(error)return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email});
	if(user)return res.status(400).send("User already exists");

	user = new User(_.pick(req.body, ['name', 'email', 'password']));

	const salt = await bcrypt.genSalt(10);//Load rounds from configuration file
	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	return res.status(200).send(_.pick(user, ['_id','name','email']));

});

module.exports = router;