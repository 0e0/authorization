const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;

// Define our model
var userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
  // unique makes sure the email is unique
  password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
	// get access to the user model
	const user = this;

	// generate a salt then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err); }

		// hash (encrypt) our password using the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
				if (err) { return next(err); }

				// overwrite plain text password with encrypted password
				user.password = hash;
				next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	// candidatePassword = password given by user, which will be hashed by bycrpt automatically
	// this.password = password that is save inside the local database
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) { return callback(err); }

		callback(null, isMatch);
	});
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema); // this loades the schema into mongoose


// Export the model
module.exports = ModelClass;
