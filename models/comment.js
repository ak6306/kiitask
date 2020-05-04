var mongoose = require('mongoose');

var commentSchema = mongoose.Schema(
	{
		text: String,
		author: String
	},
	{
		writeConcern: {
			w: 'majority',
			j: true,
			wtimeout: 5000
		}
	}
);

module.exports = mongoose.model('comment', commentSchema);
