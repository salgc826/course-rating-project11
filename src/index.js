'use strict';
//load modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const seeder = require('mongoose-seeder');
const session = require('express-session');

const courseRoutes = require('./routes/course');
const userRoutes = require('./routes/user');
const data = require('./data/data.json');
const {Course} = require('./models/course');
const {Review} = require('./models/review');
const {User} = require('./models/user');


// Establish connection to Mongo database and set port as well as database.
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/CourseRating", {useMongoClient: true});
const port = 5000;
var db = mongoose.connection;
db.on('error', function(err) {
	console.log(err);
})


// Upon connection seed data from the /data/data.json file into the Mongo
db.on('open', function() {
	seeder.seed(data)
	.then(function(dbData) {} )
	.catch(function(err) {
		console.log(err);
	});
	console.log("Successfully connected to Mongo database.");
})




app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

//set port
app.set('port', 5000);
//use morgan to log
app.use(morgan('dev'));


app.use('/', express.static('public'));


app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

//ecpress global error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
})

// Begin listenserver on port.

app.listen(app.get('port'), function() {
  	console.log('Server is now running at http://localhost:5000.');
})

module.exports = {app};
