var express = require('express');
var handlebars = require('express-handlebars');

var app = express();
var view = handlebars.create({ defaultLayout: 'main' });

app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.get('', function (req, res) {
  res.render('hack');
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Express started");
});