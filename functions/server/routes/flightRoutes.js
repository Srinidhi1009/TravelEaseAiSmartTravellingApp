const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.get('/', flightController.getFlights);
router.post('/book', flightController.bookFlight);

module.exports = router;
