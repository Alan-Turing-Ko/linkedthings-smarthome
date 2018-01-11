var express = require('express');
var expressJoi = require('express-joi-validator');

var organization = require('../models/organization');
var organizationsController = require('../controllers/organizationsController');
var auth = require('../middlewares/authenticate');

var router = express.Router();

router.get('/organizations', organizationsController.get);
router.get('/organizations/:organizationId', auth.verifyMember, organizationsController.getById);
router.post('/organizations', organizationsController.post);

module.exports = router;