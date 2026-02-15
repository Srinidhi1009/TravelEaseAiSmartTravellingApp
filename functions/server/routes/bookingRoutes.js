const express = require('express');
const router = express.Router();
const { createBooking, getBooking, getUserBookings, cancelBooking, updateBooking } = require('../controllers/bookingController');

// POST /api/bookings - Create new booking
router.post('/', createBooking);

// GET /api/bookings/:id - Get booking details
router.get('/:id', getBooking);

// GET /api/bookings/user/:userId - Get all bookings for a user
router.get('/user/:userId', getUserBookings);

// PATCH /api/bookings/:id/cancel - Cancel a booking
router.patch('/:id/cancel', cancelBooking);

// PATCH /api/bookings/:id/rebook - Rebook a flight
router.patch('/:id/rebook', updateBooking);

module.exports = router;
