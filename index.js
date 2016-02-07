var Firebase = require("firebase");
var firebase = new Firebase("https://motehacksmith.firebaseio.com/");

var express = require('express');
var handlebars = require('express-handlebars');

var app = express();
var view = handlebars.create({ defaultLayout: 'main' });

// Body Parser:
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//request:
var request = require('request');


app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('hack');
});

app.post('/send', function(req, res) {

	request({
	    url: 'https://sms.garw.net/send',
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: 	JSON.stringify({
	    	to: "+14133208380",
	    	msg: req.body.submitted_message,
	    	cburl: "http://motehacksmith-58861.onmodulus.net/receive"
			})
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log(response.statusCode, body);
	    }
	});
	res.redirect('/');
});

app.post('/receive', function(req, res) {
	var number = req.body.from;
    logref = firebase.child("coder of the week").child("voters").child(number).child('log');
    logref.push(req.body);
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function(){
	console.log("Express started");
});