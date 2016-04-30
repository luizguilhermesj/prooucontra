var express = require('express');
var router = express.Router();
var Question = require('../models/question')();
var request = require('request');
var phantom = require('phantom');
var base64Img = require('base64-img');

/* GET vote listing. */
router.post('/:hash', function(req, res, next) {
	Question.findOne({hash: req.params.hash}, function(err, question){
		var newData = {};
		var votescount = question.yes + question.no;

		if (votescount % 10 == 0) {
			request('https://graph.facebook.com?scrape=true&id='+encodeURIComponent("http://www.prooucontra.com.br/vote/"+question.hash));
			saveImage(question.hash);
		}
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

var saveImage = function(hash) {
	phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        sitepage = page;
        page.addCookie({
		  'name'     : hash,   /* required property */
		  'value'    : 'yes',  /* required property */
		  'domain'   : 'www.prooucontra.com.br',
		  'path'     : '/',                /* required property */
		  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
		});
		return page.open('http://www.prooucontra.com.br/vote/'+hash);
    })
    .then(status => {
        return sitepage.property('content');
    })
    .then(content => {
    	return sitepage.evaluate(function() {
		    return $('canvas')[0].toDataURL("image/png", 0);
		});
    })
    .then(image => {
		base64Img.img(image,'public/images/og', hash);
        sitepage.close();
        phInstance.exit();
    })
    .catch(error => {
        phInstance.exit();
    });
}

module.exports = router;
