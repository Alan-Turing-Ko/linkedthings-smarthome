var Joi = require('joi');

var user = {
    body: {
        // Organization Id is not included it will be fetched from the logged in user and added in the controller.
        // Only admin of an organization can add another user.
        _id: Joi.string().required(),
        password: Joi.string().required(),
        firstname: Joi.string().optional(),
        lastname: Joi.string().optional(),
        email: Joi.string().email().optional()
    }
}

module.exports = user;