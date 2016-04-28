var express = require('express');
var router = express.Router();
var Question = require('../models/question')();
var sh = require("shorthash");

router.post('/', function(req, res, next) {
	if (!req.body.question) {
		return res.redirect("/");
	}
	var question = new Question({
		hash: sh.unique(req.body.question),
		text: req.body.question,
		yes: 0,
		no: 0
	});
	question.save();

	return res.redirect('/vote/'+question.hash);
});



module.exports = router;
