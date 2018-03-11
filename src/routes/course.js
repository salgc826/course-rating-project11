const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mid = require('../middleware/authentication');
const {Course} = require('./../models/course');
const {Review} = require('./../models/review');

router.use(bodyParser.json());


// This will find all courses and return their title and IDs.

router.get('/', function(req, res, next) {
	Course.find( {}, 'title _id', function(err, courses) {
		if (err) {
			return next(err);
		}
		res.send(courses);
	});
})


// This will return all Course properties and review documents for

router.get('/:courseId', function(req, res, next) {
	Course.findOne({
		_id: req.params.courseId
	})
		.populate('user reviews')
		.exec(function(err, course) {
			if (err) {
				return next(err);
			}
		res.send(course);
	});
})


// This will post a new course to the database. Authentication middleware

router.post('/', mid.authentication, function(req, res, next) {
	var course = new Course(req.body);

	course.save(function(err, course) {
		if (err) {
			res.status(400);
			return next(err);
		} else {
			res.location('/')
			.status(201).json();
		}
	});
})


router.put('/:courseId', mid.authentication, function(req, res, next) {
	Course.findByIdAndUpdate(req.params.courseId, {$set:req.body}, {new: true}, function(err, course) {
		if (err) {
			return next(err);
		}
		res.status(204).json();
	});
})


// This will add a review to a course. Authentication middleware

router.post('/:courseId/reviews', mid.authentication, function(req, res, next) {
	Course.findById(req.params.courseId)
		.populate('user')
		.exec(function(err, course) {
			if (err) {
				return next(err);
			}

	var newReview = new Review(req.body);
	course.reviews.push(newReview);

	newReview.save(function(err){
        if (err) {
			return next(err);
		}
    });

	course.save(function(err){
		if (err) {
			return next(err);
		}
	});

	res.location('/' + req.params.courseId)
	.status(201).json();
	});
})

module.exports = router;
