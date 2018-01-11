var Joi = require('joi');

var room = {
    body: {
        // Organization Id is not included it will be fetched from the login user and added in the controller.
        _id: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().required(),
        description: Joi.string().optional()
    }
}

module.exports = room;