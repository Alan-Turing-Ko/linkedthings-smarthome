var eventsService = require('../services/eventsService');
var dateParser = require('../helpers/dateParser');

module.exports = {
    getByDevice: function(req, res, next) {
        var sd = 0, ed = 0;
        
        if(!req.params.startdate) {
            sd = 0;
        } else {
            sd = req.params.startDate;
        }
        
        if(!req.params.endDate) {
            ed = dateParser.dateToInt(dateParser.getDate());
        } else {
            ed = req.params.endDate;
        }
        
        eventsService.getEventsByDeviceId(req.params.deviceId, sd, ed, req.query.limit || 10, req.query.skip || 0)
        .then(function(results) {
            res.status(200).json(results);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    },
    
    getLastByRoom: function(req, res, next) {
        eventsService.getLastEventsByRoomId(req.params.roomId)
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
        var event = {
            hubId: req.body.hubId,
            deviceId: req.body.deviceId,
            value: req.body.value,
            schema: 'Event',
            created: dateParser.dateToInt(dateParser.getDate()),
            createdBy: req.decoded._id
        };
        
        eventsService.postEvent(event)
        .then(function(result) {
            res.status(201).json(result);
        })
        .catch(function(err) {
            res.status(err.statusCode).json({
                error: err.error
            });
        });
    }
}