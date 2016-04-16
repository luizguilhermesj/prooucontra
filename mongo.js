
var mongoose = require('mongoose');

var voteSchema = mongoose.Schema({
	id: String,
    yes: Number, no: Number
});

module.exports = function() {
	console.log('loaded');
	try{
		mongoose.model('Vote');
	} catch (e) {
		mongoose.model('Vote', voteSchema);
	}
	return mongoose.model('Vote');
};