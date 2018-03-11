const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mid = require('../middleware/authentication');
const {User} = require('./../models/user');

router.use(bodyParser.json());


// This will return the currently authenticated user. Authentication

router.get('/', mid.authentication, function(req, res) {
	res.send(req.user).json()
})


// This will add a new user to the database using the POST method before

router.post('/', function(req, res, next) {
	var user = {
		fullName: req.body.fullName,
		emailAddress: req.body.emailAddress,
		password: req.body.password
	};

	User.create(user, (err, user) => {
		if (err) {
			res.status(400);
			return next(err);
		} else {
			res.location('/')
			.status(201).json();
		}
	});
})

module.exports = router;
