var express = require('express');
var expressJoi = require('express-joi-validator');

var room = require('../models/room');
var roomsController = require('../controllers/roomsController');
var auth = require('../middlewares/authenticate');

var router = express.Router();

router.get('/organizations/:organizationId/rooms', auth.verifyMember, roomsController.getByOrganization);
router.get('/organizations/rooms/:roomId', auth.verifyMember, roomsController.getById);
router.post('/organizations/rooms', auth.verifyAdmin, roomsController.post);
router.put('/organizations/rooms/:roomId', auth.verifyMember, roomsController.update);
router.delete('/organizations/rooms/:roomId', auth.verifyAdmin, roomsController.delete);

module.exports = router;