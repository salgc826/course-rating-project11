const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const validator = require('validator');


// User schema.

var UserSchema = new mongoose.Schema ({
	fullName: {
		type: String,
		required: true
	},
	emailAddress: {
		type: String,
		required: true,
		unique: true,
		validate: {
			isAsync: false,
			validator: validator.isEmail,
				message: 'Not a valid email.'
		}
	},
	password: {
		type: String,
		required: true
	}
})


// authenticate input against database documents
UserSchema.statics.userAuthentication = function(email, password, callback) {
	var User = this;

	User.findOne({emailAddress: email}, function(err, user) {
		if (err){
			return callback(err);
		} else if (!user) {
			return new Error("User not found.");
		}

		bcrypt.compare(password, user.password, function(err, res) {
			if (res === true) {
				return callback(null, user);
			} else {
				return callback(err);
			}
		});
	});
}


// hash password before saving to database
UserSchema.pre('save', function(next) {
	var User = this;

	bcrypt.hash(User.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}

		User.password = hash;
		next();
		});
	}
)

var User = mongoose.model('User', UserSchema);

module.exports = {User};
