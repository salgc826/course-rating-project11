const auth = require('basic-auth');
const {User} = require('../models/user');


function authentication(req, res, next) {
	var credentials = auth (req);

	if (!credentials) {
		var err = new Error("Username and password must be valid.");
		err.status = 401;
		next(err);
	} else {
		User.userAuthentication(credentials.name, credentials.pass, function(err, user) {
			if (err || !user) {
				var error = new Error("An error has occurred during authentication.");
				res.status = 401;
				next(err);
			} else {
				req.user = user;
				next();
			}
		});
	}
}

module.exports.authentication = authentication;
