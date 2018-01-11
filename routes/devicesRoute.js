var express = require('express');
var expressJoi = require('express-joi-validator');

var device = require('../models/device');
var devicesController = require('../controllers/devicesController');
var auth = require('../middlewares/authenticate');

var router = express.Router();

router.get('/organizations/:organizationId/rooms/devices', auth.verifyMember, devicesController.getByOrganization);
router.get('/organizations/rooms/:roomId/devices', auth.verifyMember, devicesController.getByRoom);
router.get('/organizations/rooms/devices/:deviceId', auth.verifyMember, devicesController.getById);
router.post('/organizations/rooms/devices', auth.verifyAdmin, devicesController.post);
router.put('/organizations/rooms/devices/:deviceId', auth.verifyMember, devicesController.update);
router.delete('/organizations/rooms/devices/:deviceId', auth.verifyAdmin, devicesController.delete);

module.exports = router;