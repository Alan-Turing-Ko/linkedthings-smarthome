var Joi = require('joi');
var User = require('./user');

var organization = {
    body: {
        _id: Joi.string().required(),
        description: Joi.string().optional(),
        
        // Once an organization is created a new user(admin) is created for each organization.
        user: User
    }
}

module.exports = organization;