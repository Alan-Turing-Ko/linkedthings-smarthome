var bcrypt = require('bcrypt');
var dotenv = require('dotenv');
var jwt = require('jsonwebtoken');

var database = require('../helpers/databaseConnection');

dotenv.load();

module.exports = {
    getUsersByOrganizationId: function(organizationId, limit, skip) {
        return new Promise(function(resolve, reject) {
            database.find({
                selector: { '$or': [
                    { schema: 'User', organizationId: organizationId }, 
                    { schema: 'Organization', _id: organizationId }
                ]},
                fields: [ '_id', '_rev', 'organizationId', 'created' ],
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
                        resolve(body.docs.filter(u => u.organizationId == organizationId));
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
    
    getUserById: function(userId) {
        return new Promise(function(resolve, reject) {
            // The find method is used used instead of findById so that only a document with 'User' schema be queried.
            database.find({
                selector: { _id: userId, schema: 'User' },
                fields: [ '_id', '_rev', 'organizationId', 'firstname', 'lastname', 'email', 'roles', 'schema', 'created', 'createdBy' ],
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
                            error: 'User not found.' 
                        });
                    }

                    resolve(body.docs[0]);
                }
            });
        });
    },
    
    postUser: function(user) {
        return new Promise(function(resolve, reject) {
            database.insert(user, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    user._rev = body._rev;
                    delete user.password;
                    resolve(user);
                }
            });
        });
    },
    
    loginUser: function(credentials) {
        return new Promise(function(resolve, reject) {
            database.find({
                selector: { _id: credentials._id, schema: 'User' },
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
                            statusCode: 401,
                            error: 'Invalid _id.' 
                        });
                    } else {
                        if(!bcrypt.compareSync(credentials.password, body.docs[0].password)) {
                            reject({ 
                                statusCode: 401,
                                error: 'Invalid password.' 
                            });
                        } else {
                            var payload = {
                                _id: body.docs[0]._id,
                                organizationId: body.docs[0].organizationId,
                                roles: body.docs[0].roles
                            };
                            
                            var token = jwt.sign(payload, process.env.SECRET_KEY, {
                                expiresIn: 3600
                            });
                            
                            resolve({
                                token: token,
                                expiresIn: 3600
                            });
                        }
                    }
                }
            });
        });
    },
    
    updateUser: function(user, newUser) {
        return new Promise(function(resolve, reject) {
            user.firstname = newUser.firstname == null ? user.firstname : newUser.firstname;
            user.lastname = newUser.lastname == null ? user.lastname : newUser.lastname;
            user.email = newUser.email == null ? user.email : newUser.email;
            user.password = newUser.password == null ? user.password : bcrypt.hashSync(newUser.password, 10);
            
            database.insert(user, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    user._rev = body._rev;
                    delete user.password;
                    resolve(user);
                }
            });
        });
    },
    
    deleteUser: function(user) {
        return new Promise(function(resolve, reject) {
            database.destroy(user._id, user._rev, function(err, body) {
                if(err) {
                    reject({
                        statusCode: 400,
                        error: err.message
                    });
                } else {
                    resolve(user);
                }
            });
        });
    }
}