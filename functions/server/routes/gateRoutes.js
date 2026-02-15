const express = require('express');
const router = express.Router();
const gateController = require('../controllers/gateController');

router.get('/', gateController.getGateStatus);

module.exports = router;
