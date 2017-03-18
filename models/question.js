var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
	hash: { type: String, unique: true },
    text: String,
    yes: Number,
    no: Number,
    active: Boolean
});

module.exports = function() {
	try{
		return mongoose.model('Question');
	} catch (e) {
		return mongoose.model('Question', questionSchema);
	}
};