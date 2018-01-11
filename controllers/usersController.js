var bcrypt = require('bcrypt');

var usersService = require('../services/usersService');
var dateParser = require('../helpers/dateParser');

module.exports = {
    getByOrganization: function(req, res, next) {
        usersService.getUsersByOrganizationId(req.params.organizationId, req.query.limit || 10, req.query.skip || 0)
        .then(function(results) {
            res.status(200).json(results);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    getById: function(req, res, next) {
        usersService.getUserById(req.params.userId)
        .then(function(result) {
            res.status(200).json(result);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    post: function(req, res, next) {
        var user = {
            _id: req.body._id,
            organizationId: req.decoded.organizationId,
            password: bcrypt.hashSync(req.body.password, 10),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            roles: [ 'User' ],
            schema: 'User',
            created: dateParser.dateToInt(dateParser.getDate()),
            createdBy: req.decoded._id
        };
        
        usersService.postUser(user)
        .then(function(result) {
            res.status(201).json(result);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    login: function(req, res, next) {
        var credentials = {
            _id: req.body._id,
            password: req.body.password
        };
        
        usersService.loginUser(credentials)
        .then(function(results) {
            res.status(200).json(results);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    update: function(req, res, next) {
        usersService.getUserById(req.params.userId)
        .then(function(result) {
            var newUser = {
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            };
            
            usersService.updateUser(result, newUser)
            .then(function(result) {
                res.status(200).json(result);
            })
            .catch(function(err) {
                res.status(err.statusCode).json({
                    error: err.error
                });
            });
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    delete: function(req, res, next) {
        usersService.getUserById(req.params.userId)
        .then(function(result) {
            usersService.deleteUser(result)
            .then(function(result) {
                res.status(200).json(result);
            })
            .catch(function(err) {
                res.status(err.statusCode).json({
                    error: err.error
                });
            });
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    }
}