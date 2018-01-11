var Joi = require('joi');

var credentials = {
    body: {
        _id: Joi.string().required(),
        password: Joi.string().required()
    }
}

module.exports = credentials;