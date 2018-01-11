var dotenv = require('dotenv');
var database = require('../helpers/databaseConnection');
var watson = require('../helpers/mqttConnection');

dotenv.load();

watson.appClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
    // Handle mqtt events. 
});
