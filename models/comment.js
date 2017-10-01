let mongoose = require('mongoose');

// comment schema
let commentSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	author:{
		type: String,
		required: true
	},
	body:{
		type: String,
		required: true
	}
});

let Comment = module.exports = mongoose.model('Comment', commentSchema);
