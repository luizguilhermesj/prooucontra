var express = require('express');
var router = express.Router();
var Vote = require('../mongo')();

/* GET vote listing. */
router.post('/', function(req, res, next) {
	Vote.findOne({id:'master'}, function(err, vote){
		if (vote.length == 0) {
			var voting = new Vote({id: 'master', yes: 0, no: 0});
			voting.save();
		}
		var newData = {};
		newData[req.body.vote] = vote[req.body.vote]+1

		Vote.findOneAndUpdate({_id: vote._id}, newData, function(err, doc){
			console.log(doc);
		})
	})

  res.send('respond with a resource');
});

module.exports = router;
