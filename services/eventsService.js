var dotenv = require('dotenv');
var database = require('../helpers/databaseConnection');
var watson = require('../helpers/mqttConnection');

dotenv.load();

watson.appClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
    // Handle mqtt events. 
});

module.exports = {
    getEventsByDeviceId: function(deviceId, startDate, endDate, limit, skip) {
        return new Promise(function(resolve, reject) {
            database.find({
                selector: { 
                    '$or': [
                        {
                            schema: 'Event', 
                            deviceId: deviceId, 
                            '$and': [
                              { created: { '$gt': startDate } },
                              { created: { '$lt': endDate } }
                          ]
                        },
                        {
                            schema: 'Device',
                            _id: deviceId
                        }
                    ]},
                // Increase limit by 1 as the device will also be returned.
                limit: limit + 1,
                skip: skip,
                sort: [
                    {
                        'created:number': 'desc'
                    }
                ]
            }, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    // If length is greater than 0 that means device exists.
                    if(body.docs.length > 0) {
                        resolve(body.docs.filter(e => e._id != deviceId));
                    } else {
                        reject({
                            statusCode: 404,
                            error: 'Device not found.'
                        });
                    }
                }
            });
        });
    },
    
    getLastEventsByRoomId: function(roomId) {
        return new Promise(function(resolve, reject) {
            // Check if room exists.
            database.find({
                selector: { _id: roomId, schema: 'Room' },
                limit: 1
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
                        // Querying view on Cloudant.
                        database.view('rooms', 'lastevents', {
                            startkey: [ roomId, 0, 0],
                            endkey: [ roomId, [ 0 ], 1],
                            reduce: true,
                            group: true
                        }, function(err, body) {
                            if(err) {
                               reject({
                                    statusCode: 400,
                                    error: err.message
                                });
                            } else {
                               var results = body.rows.map(r => r.value);
                               resolve(results);
                            }
                       }); 
                    }
                }
            });
        });
    },
    
    postEvent: function(event) {
        return new Promise(function(resolve, reject) {
            // Check if the device exists.
            database.find({
                selector: { '$or': [
                    { _id: event.deviceId, schema: 'Device' },
                    { _id: event.hubId, schema: 'Device' },
                ]}
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
                           error: 'Hub not found.'
                       });
                    } else if(body.docs.length == 1) {
                        reject({
                           statusCode: 404,
                           error: 'Device not found.'
                       });
                    } else {
                        database.insert(event, function(err, body) {
                            if(err) {
                               reject({
                                   statusCode: 400,
                                   error: err.message
                               });
                            } else {
                                // Add _rev to event model before returning.
                                event._rev = body.rev;
                                resolve(event);
                            }
                        });
                    }
                }
            });
        });
    }
}