var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema(
	{
		username: String,
		password: String,
		school: String,
		year: String,
		email: String,
		post: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'post'
			}
		],
		comment: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'comment'
			}
		]
	},
	{
		writeConcern: {
			w: 'majority',
			j: true,
			wtimeout: 5000
		}
	}
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
