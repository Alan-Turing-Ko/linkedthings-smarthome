var express = require('express');
var expressJoi = require('express-joi-validator');

var user = require('../models/user');
var usersController = require('../controllers/usersController');
var auth = require('../middlewares/authenticate');

var router = express.Router();

router.get('/organizations/:organizationId/users', auth.verifyMember, usersController.getByOrganization);
router.get('/organizations/users/:userId', auth.verifyAdminOrResourceOwner, usersController.getById);
router.post('/organizations/users', auth.verifyAdmin, usersController.post);
router.post('/organizations/users/login', usersController.login);
router.put('/organizations/users/:userId', auth.verifyAdminOrResourceOwner, usersController.update);
router.delete('/organizations/users/:userId', auth.verifyAdminOrResourceOwner, usersController.delete);

module.exports = router;