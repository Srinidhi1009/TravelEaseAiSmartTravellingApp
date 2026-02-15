const { db } = require('../config/firebase-config');

const createBooking = async (req, res) => {
    try {
        const {
            userId, // Optional if we have auth, but can be 'guest'
            tripData,
            prices,
            paymentId
        } = req.body;

        if (!tripData || !prices) {
            return res.status(400).json({ error: "Missing trip data or prices" });
        }

        const bookingRef = db.collection('bookings').doc();
        const bookingData = {
            id: bookingRef.id,
            userId: userId || 'guest',
            tripData,
            prices,
            paymentId: paymentId || `PAY-${Date.now()}`,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        await bookingRef.set(bookingData);

        res.status(201).json({
            message: "Booking created successfully",
            bookingId: bookingRef.id,
            booking: bookingData
        });

    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Failed to create booking" });
    }
};

const getBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('bookings').doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ error: "Failed to fetch booking" });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookingsSnapshot = await db.collection('bookings')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = [];
        bookingsSnapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ error: "Failed to fetch user bookings" });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('bookings').doc(id).update({
            status: 'Cancelled',
            updatedAt: new Date().toISOString()
        });
        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel booking" });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { travelDate, departureTime, status } = req.body;

        await db.collection('bookings').doc(id).update({
            'tripData.travelDate': travelDate,
            departureTime: departureTime,
            status: status || 'Rebooked',
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({ message: "Booking updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update booking" });
    }
};

module.exports = { createBooking, getBooking, getUserBookings, cancelBooking, updateBooking };
