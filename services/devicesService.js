var dotenv = require('dotenv');
var database = require('../helpers/databaseConnection');

dotenv.load();

module.exports = {
    getDevicesByOrganizationId: function(organizationId, limit, skip) {
        return new Promise(function(resolve, reject) {
            database.find({
                selector: { '$or': [
                    { schema: 'Device', _id: { '$regex': '^' + organizationId + '_' } },
                    { schema: 'Organization', _id: organizationId }
                ]},
                // Increase limit by 1 as the organization will also be returned.
                limit: limit + 1,
                skip: skip
            }, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    // If length is greater than 0 that means organization exists.
                    if(body.docs.length > 0) {
                        resolve(body.docs.filter(d => d._id != organizationId));
                    } else {
                        reject({
                            statusCode: 404,
                            error: 'Room not found.'
                        });
                    }
                }
            });
        });
    },
    
    getDevicesByRoomId: function(roomId, limit, skip) {
        return new Promise(function(resolve, reject) {
            database.find({
                selector: { '$or': [
                    { schema: 'Device', roomId: roomId },
                    { schema: 'Room', _id: roomId }
                ]},
                // Increase limit by 1 as the room will also be returned.
                limit: limit + 1,
                skip: skip
            }, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    // If length is greater than 0 that means organization exists.
                    if(body.docs.length > 0) {
                        resolve(body.docs.filter(d => d.roomId == roomId));
                    } else {
                        reject({
                            statusCode: 404,
                            error: 'Room not found.'
                        });
                    }
                }
            });
        });
    },
    
    getDeviceById: function(deviceId) {
        return new Promise(function(resolve, reject) {
            // The find method is used used instead of findById so that only a document with 'Device' schema be queried.
            database.find({
                selector: { _id: deviceId, schema: 'Device' },
                limit: 1
            }, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    if(!body.docs[0]) {
                        reject({ 
                            statusCode: 404,
                            error: 'Device not found.' 
                        });
                    }

                    resolve(body.docs[0]);
                }
            });
        });
    },
    
    postDevice: function(device) {
        return new Promise(function(resolve, reject) {
            // Check if the room exists.
            database.find({
                selector: { _id: device.roomId, schema: 'Room'}
            }, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    if(body.docs.length == 0) {
                        reject({
                           statusCode: 404,
                           error: 'Room not found.'
                       });
                    } else {
                        database.insert(device, function(err, body) {
                            if(err) {
                               reject({
                                   statusCode: 409,
                                   error: 'Device already exists.'
                               });
                            } else {
                                // Add _rev to device model before returning.
                                device._rev = device.rev;
                                resolve(device);
                            }
                        });
                    }
                }
            });
        });
    },
    
    updateDevice: function(device, newDevice) {
        return new Promise(function(resolve, reject) {
            device.name = newDevice.name == null ? device.name : newDevice.name;
            device.description = newDevice.description == null ? device.description : newDevice.description;
            device.version = newDevice.version == null ? device.version : newDevice.version;
            device.metadata = newDevice.metadata == null ? device.metadata : newDevice.metadata;
            
            database.insert(device, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    device._rev = body._rev;
                    resolve(device);
                }
            });
        });
    },
    
    deleteDevice: function(device) {
        return new Promise(function(resolve, reject) {
            database.destroy(device._id, device._rev, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    resolve(device);
                }
            });
        });
    }
}