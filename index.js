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
	    	to: req.body.to,
	    	msg: req.body.msg,
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
	//use the number to get a reference to their data
	var number = req.body.from;
	var vote = req.body.msg;
	var geoinfo = {
		zip: req.body.zip,
		city: req.body.city,
		state: req.body.state
	}
	var eligible = eligibility.number;
	if(eligible){
		console.log("you are eligible!");
		cast_vote(eligible.election_name, eligible.voter_name, vote,  geoinfo);
	}
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Express started");
});

function cast_vote(election_name, voter_name, vote, geoinfo){
	firebase.child(election_name).child("voters").child(voter_name).update({vote: vote});
	//firebase.child(election_name).child(voter_name).update(geoinfo);
}

var eligibility = {};

function pend_election(name){
	console.log("pending: "+name);
	firebase.child(name).child("active").on("value", function(snapshot){
		console.log("active-value: "+snapshot.val());
		if(snapshot.val() == "True"){
			console.log("starting: "+name);
			open_election(name);
		}else{
			//close_election(name);
		}
	})
}

firebase.on("child_added", function(snapshot){
	pend_election(snapshot.key());
});

function open_election(election_name){
	firebase.child(election_name).child("voters").on("value", function(snapshot){
		snapshot.forEach(function(child){
			eligibility.number = {election_name: election_name, voter_name: child.key()}
		})
	})
	console.log(eligibility);
}
