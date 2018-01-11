var bcrypt = require('bcrypt');

var organizationsService = require('../services/organizationsService');
var dateParser = require('../helpers/dateParser');

module.exports = {
    get: function(req, res, next) {
        organizationsService.getOrganizations(req.query.limit || 10, req.query.skip || 0)
        .then(function(results) {
            res.status(200).json(results);
        }).catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    getById: function(req, res, next) {
        organizationsService.getOrganizationById(req.params.organizationId)
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
        // Fetch organization object from body of the request.
        var organization = {
            _id: req.body._id,
            description: req.body.description,
            schema: 'Organization',
            created: dateParser.dateToInt(dateParser.getDate())
        };
        
        // Fetch user object from body of the request.
        var user = {
            _id: req.body.user._id,
            password: bcrypt.hashSync(req.body.user.password, 10),
            organizationId: req.body._id,
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            email: req.body.user.email,
            roles: [ 'Admin' ],
            schema: 'User',
            created: dateParser.dateToInt(dateParser.getDate())
        };
        
        
        organizationsService.postOrganization(organization)
        .then(function(organization) {
            organizationsService.postAdmin(user)
            .then(function(user) {
                res.status(201).json(user);
            })
            .catch(function(err) {
                organizationsService.deleteOrganization(organization)
                .then(function(result) {
                    res.status(err.statusCode).json({
                        error: err.error
                    });
                })
                .catch(function(err) {
                    res.status(err.statusCode).json({
                        error: err.error
                    });
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