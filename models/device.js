var Joi = require('joi');

var device = {
    body: {
        _id: Joi.string().required(),
        //The device may or may not be connected to a hub. The device maybe a Hub itself.
        hubId: Joi.string().optional(),
        roomId: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().optional(),
        type: Joi.string().required(),
        version: Joi.string().required(),
        metadata: Joi.object().optional()
    }
}

module.exports = device;