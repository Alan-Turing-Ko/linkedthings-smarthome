var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

// Require all routes.
var eventsRoutes = require('./routes/eventsRoute');
var devicesRoutes = require('./routes/devicesRoute');
var roomsRoutes = require('./routes/roomsRoute');
var usersRoutes = require('./routes/usersRoute');
var organizationsRoutes = require('./routes/organizationsRoute');

// Load environment variables.
dotenv.load();

var app = express();
var port = process.env.PORT;

// Log requests.
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use all routes.
app.use('/api/v1/', eventsRoutes);
app.use('/api/v1/', devicesRoutes);
app.use('/api/v1/', roomsRoutes);
app.use('/api/v1/', usersRoutes);
app.use('/api/v1/', organizationsRoutes);

// Start the server.
app.listen(port, function(){
    console.log('App running on port ' + port); 
});