var express = require('express');
var router = express.Router();
var Vote = require('../mongo')();

/* GET home page. */
router.get('/', function(req, res, next) {

	var pros, cons;

	Vote.findOne({id:'master'}, function(err, vote){
		var pros = vote.yes;
		var cons = vote.no;
		  if (req.cookies.voted) {
		  	res.render('index-done', {
			  	pros: pros,
			  	cons: cons,
			  	cookie: req.cookies.voted,
			  	voted: (req.cookies.voted == 'yes') ? 'pró' : 'contra'
			});	
		  }
		  res.render('index', {
		  	pros: pros,
		  	cons: cons,
		  	csrf: req.csrfToken()
		  });
	});
});

module.exports = router;
