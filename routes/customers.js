const express = require('express');
const { Customer, validate } = require('../models/customer');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = express.Router();

router.get("/", async function(req, res){

	const customers = await Customer.find();
	
	return res.status(200).send(customers);

});

router.get("/:id", async function(req, res){

	const customer = await Customer.findById(req.params.id);

	if(!customer)return res.status(404).send("The customer with the given ID was not found.");

	return res.status(200).send(customer);

});

router.post("/", auth, async function(req, res){

	const { error } = validate(req.body);

	if(error)return res.status(400).send(error.details[0].message);

	const customer = new Customer({
		name: req.body.name,
		isGold: req.body.isGold,
		phone: req.body.phone
	});

	await customer.save();

	return res.status(200).send(customer);

});

router.put("/:id", auth, async function(req, res){

	const { error } = validate(req.body);

	if(error)return res.status(400).send(error.details[0].message);

	const customer = await Customer.findByIdAndUpdate(req.params.id,{
			name: req.body.name,
			isGold: req.body.isGold,
			phone: req.body.phone
	}, {new: true});

	if(!customer)return res.status(404).send("The customer with the given ID was not found.");

	return res.status(200).send(customer);
});

router.delete("/:id", [auth, admin], async function(req, res){

	const customer = await Customer.findByIdAndRemove(req.params.id);

	if(!customer)return res.status(404).send("The customer with the given ID was not found.");;

	return res.status(200).send(customer);
});

/* #Comment
createCustomer({name: "sudeep", isGold: true, phone: "9876543212"} );
createCustomer({name: "indraj", isGold: false, phone: "9584672135"} );
*/

module.exports = router;