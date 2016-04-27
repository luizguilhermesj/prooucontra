var express = require('express');
var router = express.Router();
var Question = require('../models/question')();

/* GET vote listing. */
router.post('/:hash', function(req, res, next) {
	Question.findOne({hash: req.params.hash}, function(err, question){
		var newData = {};
		newData[req.body.vote] = question[req.body.vote]+1;

		Question.findOneAndUpdate({_id: question._id}, newData, function(err, doc){
			console.log(doc);
		})
	})

  res.send('respond with a resource');
});

router.get('/:hash', function(req, res, next) {
	var pros, cons;

	Question.findOne({hash: req.params.hash}, function(err, question){
		var pros = question.yes;
		var cons = question.no;
		if (req.cookies[question.hash]) {
			return res.render('question-done', {
				hash: question.hash,
				question: question.text,
			  	pros: pros,
			  	cons: cons,
			  	cookie: req.cookies[question.hash],
			  	voted: (req.cookies[question.hash] == 'yes') ? 'pró' : 'contra'
			});	
		} 

		return res.render('question', {
			hash: question.hash,
			question: question.text,
			pros: pros,
			cons: cons,
			csrf: req.csrfToken()
		});

  		res.send(question.text);
	})
});

module.exports = router;
