var roomsService = require('../services/roomsService');
var dateParser = require('../helpers/dateParser');

module.exports = {
    getByOrganization: function(req, res, next) {
        roomsService.getRoomsByOrganizationId(req.params.organizationId, req.query.limit || 10, req.query.skip || 0)
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
        roomsService.getRoomById(req.params.roomId)
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
        var room = {
            _id: req.decoded.organizationId + '_' + req.body._id,
            organizationId: req.decoded.organizationId,
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            schema: 'Room',
            created: dateParser.dateToInt(dateParser.getDate()),
            createdBy: req.decoded._id
        };
        
        roomsService.postRoom(room)
        .then(function(result) {
            res.status(201).json(result);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    update: function(req, res, next) {
        roomsService.getRoomById(req.params.roomId)
        .then(function(result) {
            var newRoom = {
                name: req.body.name,
                description: req.body.description,
                type: req.body.type
            };
            
            roomsService.updateRoom(result, newRoom)
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
        roomsService.getRoomById(req.params.roomId)
        .then(function(result) {
            roomsService.deleteRoom(result)
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