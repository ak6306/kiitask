var mongoose = require('mongoose');

var emailSchema = mongoose.Schema(
	{
		emailId: String
	},
	{
		writeConcern: {
			w: 'majority',
			j: true,
			wtimeout: 5000
		}
	}
);

module.exports = mongoose.model('email', emailSchema);
