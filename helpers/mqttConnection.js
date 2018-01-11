var dotenv = require('dotenv');
var uuid = require('uuid/v1');
var mqttClient = require("ibmiotf");

dotenv.load();

var appClientConfig = {
    // Using '' for fields with - seperator
    org: process.env.WATSON_ORG,
    id: uuid(),
    'auth-key': process.env.WATSON_APIKEY,
    'auth-token': process.env.WATSON_APITOKEN
};

var deviceClientConfig = {
    org: process.env.WATSON_ORG,
    id: process.env.WATSON_DEVICEID,
    type: process.env.WATSON_DEVICETYPE,
    'auth-method': process.env.WATSON_AUTHMETHOD,
    'auth-token': process.env.WATSON_AUTHTOKEN
};

var appClient = new mqttClient.IotfApplication(appClientConfig);
appClient.connect();

var deviceClient = new mqttClient.IotfDevice(deviceClientConfig);
deviceClient.connect();

appClient.on('connect', function () {
    console.log('App connected to IotWatson.');
    appClient.subscribeToDeviceEvents();
});

deviceClient.on('connect', function () {
    console.log('Device connected to IotWatson.');
});

module.exports = {
    appClient: appClient,
    deviceClient: deviceClient
}