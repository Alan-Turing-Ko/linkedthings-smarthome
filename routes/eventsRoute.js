var express = require('express');
var expressJoi = require('express-joi-validator');

//var event = require('../models/event');
var eventsController = require('../controllers/eventsController');
var auth = require('../middlewares/authenticate');

var router = express.Router();

router.get('/organizations/rooms/devices/:deviceId/events', auth.verifyMember, eventsController.getByDevice);
router.get('/organizations/rooms/:roomId/devices/events', auth.verifyMember, eventsController.getLastByRoom);
router.post('/organizations/rooms/devices/events', auth.verifyAdmin, eventsController.post);

module.exports = router;