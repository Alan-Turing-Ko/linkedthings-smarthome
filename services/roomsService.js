var dotenv = require('dotenv');
var database = require('../helpers/databaseConnection');

dotenv.load();

module.exports = {
    getRoomsByOrganizationId: function(organizationId, limit, skip) {
        return new Promise(function(resolve, reject) {
            database.find({
                selector: { '$or': [
                    { schema: 'Room', organizationId: organizationId },
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
                        resolve(body.docs.filter(r => r.organizationId == organizationId));
                    } else {
                        reject({
                            statusCode: 404,
                            error: 'Organization not found.'
                        });
                    }
                }
            });
        });
    },
    
    getRoomById: function(roomId) {
        return new Promise(function(resolve, reject) {
            database.view('rooms', 'details', {
               startkey: [ roomId, 0],
               endkey: [roomId, 4]
            }, function(err, body) {
                if(err) {
                   reject({
                        statusCode: 400,
                        error: err.message
                    });
               } else {
                   if(!body.rows[0]) {
                       reject({
                           statusCode: 404,
                           error: 'Room not found.'
                       });
                   } else {
                       var room = { };
                       var obj = body.rows.shift();

                       // Create nested documents.
                       // Documents are already sorted by Cloudant.
                       while(obj) {
                           if(obj.value.schema == 'Room') {
                               obj.value.devices = [];
                               room = obj.value;
                           } else if(obj.value.schema == 'Device') {
                               room.devices.filter(r => r._id == obj.value.roomId)[0].devices.push(obj.value);
                           }

                           obj = body.rows.shift();
                       }

                       resolve(room);
                   }
               }
            });
        });
    },
    
    postRoom: function(room) {
        return new Promise(function(resolve, reject) {
            database.insert(room, function(err, body) {
                if(err) {
                   reject({
                       statusCode: 409,
                       error: 'Room already exists.'
                   });
                } else {
                    // Add _rev to room model before returning.
                    room._rev = body.rev;
                    resolve(room);
                }
            });
        });
    },
    
    updateRoom: function(room, newRoom) {
        return new Promise(function(resolve, reject) {
            room.name = newRoom.name == null ? room.name : newRoom.name;
            room.description = newRoom.description == null ? room.description : newRoom.description;
            room.type = newRoom.type == null ? room.type : newRoom.type;
            
            database.insert(room, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    room._rev = body._rev;
                    resolve(room);
                }
            });
        });
    },
    
    deleteRoom: function(room) {
        return new Promise(function(resolve, reject) {
            database.destroy(room._id, room._rev, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    resolve(room);
                }
            });
        });
    }
}