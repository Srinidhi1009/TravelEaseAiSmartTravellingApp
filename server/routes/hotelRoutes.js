const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

router.get('/', hotelController.getHotels);
router.post('/book', hotelController.bookHotel);

module.exports = router;
