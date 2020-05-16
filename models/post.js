var mongoose = require('mongoose');

var postSchema = new mongoose.Schema(
	{
		title: String,
		description: String,
		author: {
			username: String,
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			},
			email: String,
			school: String,
			year: String
		},
		created_at: { type: Date, default: Date.now },
		upvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		downvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
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
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('post', postSchema);
