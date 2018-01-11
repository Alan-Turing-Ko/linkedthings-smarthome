var devicesService = require('../services/devicesService');
var dateParser = require('../helpers/dateParser');

module.exports = {
    getByOrganization: function(req, res, next) {
        devicesService.getDevicesByOrganizationId(req.params.organizationId, req.query.limit || 10, req.query.skip || 0)
        .then(function(results) {
            res.status(200).json(results);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    getByRoom: function(req, res, next) {
        devicesService.getDevicesByRoomId(req.params.roomId, req.query.limit || 10, req.query.skip || 0)
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
        devicesService.getDeviceById(req.params.deviceId)
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
        var device = {
            // roomId already contains organizationId.
            _id: req.body.roomId + '_' + req.body._id,
            roomId: req.body.roomId,
            hubId: req.body.hubId,
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            version: req.body.version,
            metadata: req.body.metadata,
            schema: 'Device',
            created: dateParser.dateToInt(dateParser.getDate()),
            createdBy: req.decoded._id
        };
        
        if(req.body.hubId) {
            devicesService.getDeviceById(req.body.hubId)
            .then(function(result) {
                devicesService.postDevice(device)
                .then(function(result) {
                    res.status(201).json(result);
                })
                .catch(function(err) {
                    res.status(err.statusCode).json({
                        error: err.error
                    });
                });
            })
            .catch(function(err) {
                // Return custom error that hub not found. The error we are getting here states that the device is not found.
                res.status(404).json({
                    error: 'Hub not found.'
                });
            });
        } else {
            devicesService.postDevice(device)
            .then(function(result) {
                res.status(201).json(result);
            })
            .catch(function(err) {
                res.status(err.statusCode).json({
                    error: err.error
                });
            });
        }
    },
    
    update: function(req, res, next) {
        devicesService.getDeviceById(req.params.deviceId)
        .then(function(result) {
            var newDevice = {
                name: req.body.name,
                description: req.body.description,
                version: req.body.version,
                metadata: req.body.metadata
            };
            
            devicesService.updateDevice(result, newDevice)
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
        devicesService.getDeviceById(req.params.deviceId)
        .then(function(result) {
            devicesService.deleteDevice(result)
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