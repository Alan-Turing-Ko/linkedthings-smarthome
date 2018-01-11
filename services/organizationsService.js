var dateParser = require('../helpers/dateParser');
var database = require('../helpers/databaseConnection');

module.exports = {    
    getOrganizations: function(limit, skip) {
        return new Promise(function(resolve, reject) {
            database.find({
                selector: { schema: 'Organization' },
                fields: [ '_id', '_rev', 'description', 'created' ],
                limit: parseInt(limit),
                skip: parseInt(skip)
            }, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    resolve(body.docs);
                }
            });
        });
    },

    getOrganizationById: function(organizationId) {
        return new Promise(function(resolve, reject) {
            // Querying view on Cloudant.
            database.view('organizations', 'details', {
               startkey: [ organizationId, 0],
               endkey: [organizationId, 4]
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
                           error: 'Organization not found.'
                       });
                   }
                   
                   var organization = { };
                   var obj = body.rows.shift();

                   // Create nested documents.
                   // Documents are already sorted by Cloudant.
                   while(obj) {
                       if(obj.value.schema == 'Organization') {
                           obj.value.rooms = [];
                           organization = obj.value;
                       } else if(obj.value.schema == 'Room') {
                           obj.value.devices = [];
                           organization.rooms.push(obj.value);
                       } else if(obj.value.schema == 'Device') {
                           organization.rooms.filter(r => r._id == obj.value.roomId)[0].devices.push(obj.value);
                       }

                       obj = body.rows.shift();
                   }

                   resolve(organization);
               }
           }); 
        });
    },

    postOrganization: function(organization) {
        return new Promise(function(resolve, reject) {
            database.insert(organization, function(err, body) {
                if(err) {
                   reject({
                       statusCode: 409,
                       error: 'Organization already exists.'
                   });
                } else {
                    // Add _rev to organization model before returning.
                    organization._rev = body.rev;
                    resolve(organization);
                }
            });
        });
    },

    deleteOrganization: function(organization) {
        return new Promise(function(resolve, reject) {
            database.destroy(organization._id, organization._rev, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    resolve(organization);
                }
            });
        });
    },

    postAdmin: function(user) {
        return new Promise(function(resolve, reject) {
            database.insert(user, function(err, body) {
                if(err) {
                    reject({
                       statusCode: 409,
                       error: 'User already exists.'
                   });
                } else {
                    // Add _rev to user model before returning.
                    user._rev = body.rev;
                    delete user.password;
                    resolve(user); 
                }  
            });
        });
    }
}