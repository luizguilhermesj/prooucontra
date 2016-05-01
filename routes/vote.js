var express = require('express');
var router = express.Router();
var Question = require('../models/question')();
var request = require('request');
var base64Img = require('base64-img');

/* GET vote listing. */
router.post('/:hash', function(req, res, next) {
	Question.findOne({hash: req.params.hash}, function(err, question){
		var newData = {};
		var votescount = question.yes + question.no;
		newData[req.body.vote] = question[req.body.vote]+1;


		Question.findOneAndUpdate({_id: question._id}, newData, function(err, doc){

			if (votescount < 10 || votescount % 10 == 0) {
					request('https://graph.facebook.com?scrape=true&id='+encodeURIComponent(res.app.get('config').url+"/vote/"+question.hash));
					saveImage(question.hash, res);
			} else {
				res.end();
			}
		});
	});
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
			  	voted: (req.cookies[question.hash] == 'yes') ? 'pró' : 'contra',
			  	url: res.app.get('config').url
			});	
		} 

		return res.render('question', {
			hash: question.hash,
			question: question.text,
			pros: pros,
			cons: cons,
			csrf: req.csrfToken(),
			url: res.app.get('config').url
		});

  		res.send(question.text);
	})
});

var saveImage = function(hash, res) {
	var config = require('../config/config');
	config.url = "http://localhost:3000";
	config.domain = "localhost";
	var sitepage = null;
	var phInstance = null;

	phantom.create()
	.then(function(instance) {
	    phInstance = instance;
	    return instance.createPage();
	})
	.then(function(page) {
	    sitepage = page;
	    page.addCookie({
		  'name'     : hash,   /* required property */
		  'value'    : 'yes',  /* required property */
		  'domain'   : config.domain,
		  'path'     : '/',                /* required property */
		  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
		});
		return page.open(config.url+'/vote/'+hash);
	})
	.then(function(status) {
	    return sitepage.property('content');
	})
	.then(function(content) {
		return sitepage.evaluate(function() {
				    return $('canvas')[0].toDataURL('image/png', 0);
				})
	})
	.then(function(image) {
		base64Img.img(image, config.imagesPath, hash, function(){
		    sitepage.close();
			res.end();
			phInstance.exit();
		});
	})
	.catch(function(error) {
		res.end();
	    phInstance.exit();
	});
}

module.exports = router;
