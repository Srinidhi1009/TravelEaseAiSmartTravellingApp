// Mock Cab Types
const cabTypes = [
    { type: 'Auto', baseFare: 30, farePerKm: 15 },
    { type: 'Sedan', baseFare: 50, farePerKm: 20 },
    { type: 'SUV', baseFare: 80, farePerKm: 30 },
    { type: 'Bike', baseFare: 20, farePerKm: 10 }
];

// Get Cabs (Estimate Fare)
exports.getCabs = (req, res) => {
    try {
        const { pickup, drop, distance } = req.query; // distance in km
        const dist = parseFloat(distance) || 10; // Default 10km for mock

        // Time-based surcharge (Mock: Night time 10pm-6am)
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 22 || currentHour < 6;
        const surcharge = isNight ? 1.25 : 1.0;

        const estimates = cabTypes.map(cab => ({
            ...cab,
            pickup,
            drop,
            totalFare: Math.round((cab.baseFare + (cab.farePerKm * dist)) * surcharge),
            isNightCharge: isNight
        }));

        res.json(estimates);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Book Cab
exports.bookCab = (req, res) => {
    const { cabType, pickup, drop } = req.body;
    res.json({
        message: 'Cab booked successfully',
        bookingId: 'CB' + Date.now(),
        driver: {
            name: 'Ramesh Kumar',
            phone: '+91 9876543210',
            vehicleNumber: 'TS 09 AB 1234'
        },
        eta: '5 mins'
    });
};
