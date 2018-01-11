var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

// Load environment variables.
dotenv.load();

var app = express();
var port = process.env.PORT;

// Log requests.
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Start the server.
app.listen(port, function(){
    console.log('App running on port ' + port); 
});