var express = require('express');
var handlebars = require('express-handlebars');

var app = express();
var view = handlebars.create({ defaultLayout: 'main' });

// Body Parser:
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('hack');
});

app.post('/send', function(req, res) {
	console.log(req.body.submitted_message);
	res.redirect('/');
})

app.listen(process.env.PORT || 3000, function(){
	console.log("Express started");
});