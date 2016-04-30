var express = require('express');
var router = express.Router();
var Question = require('../models/question')();
var sh = require("shorthash");

/* GET home page. */
router.get('/', function(req, res, next) {
	Question.find({}, function(err, questions){
		return res.render('index', {
			questions: questions,
			csrf: req.csrfToken(),
			url: res.app.get('config').url
		});	
	});
});

module.exports = router;
