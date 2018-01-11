var Cloudant = require('cloudant');
var dotenv = require('dotenv');

// Load environment variables.
dotenv.load();

// Connect Cloudant database.
var cloudant = Cloudant({ 
    account: process.env.CLOUDANT_USERNAME,  
    password: process.env.CLOUDANT_PASSWORD
}, function(err, cloudant) {
    if(err) {
        console.log('Failed to connect Cloudant.');
    } else {
        console.log('Connected to Cloudant.');
    }
});

var database = cloudant.db.use(process.env.CLOUDANT_DATABASE);

module.exports = database;