// Mock Flight Data (India Only)
const flights = [
    {
        id: 'F101',
        airline: 'IndiGo',
        flightNumber: '6E-554',
        source: 'Hyderabad (HYD)',
        destination: 'Delhi (DEL)',
        departureTime: '2023-11-25T10:00:00',
        arrivalTime: '2023-11-25T12:15:00',
        basePrice: 4500,
        gateNumber: '12A'
    },
    {
        id: 'F102',
        airline: 'Air India',
        flightNumber: 'AI-840',
        source: 'Mumbai (BOM)',
        destination: 'Bengaluru (BLR)',
        departureTime: '2023-11-25T14:30:00',
        arrivalTime: '2023-11-25T16:00:00',
        basePrice: 5200,
        gateNumber: '4B'
    },
    {
        id: 'F103',
        airline: 'Vistara',
        flightNumber: 'UK-812',
        source: 'Delhi (DEL)',
        destination: 'Chennai (MAA)',
        departureTime: '2023-11-26T08:00:00',
        arrivalTime: '2023-11-26T10:45:00',
        basePrice: 6500,
        gateNumber: 'T3-15'
    }
];

// Helper to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Get Flights
exports.getFlights = (req, res) => {
    try {
        let results = flights;
        const { source, destination, date } = req.query;

        if (source) {
            results = results.filter(f => f.source.toLowerCase().includes(source.toLowerCase()));
        }
        if (destination) {
            results = results.filter(f => f.destination.toLowerCase().includes(destination.toLowerCase()));
        }
        // Simple mock date filter (assumes YYYY-MM-DD)
        if (date) {
            results = results.filter(f => f.departureTime.startsWith(date));
        }

        // Apply Dynamic Pricing Logic (Mock)
        const enrichedResults = results.map(flight => {
            let dynamicPrice = flight.basePrice;

            // Weekend Surge (Mock logic: if flight is F102)
            if (flight.id === 'F102') {
                dynamicPrice *= 1.15; // 15% surge
            }

            return {
                ...flight,
                dynamicPrice: Math.round(dynamicPrice),
                formattedPrice: formatCurrency(Math.round(dynamicPrice)),
                class: 'Economy', // Default
                gateStatus: 'same' // Default
            };
        });

        res.json(enrichedResults);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Book Flight
exports.bookFlight = (req, res) => {
    // Mock booking
    const { flightId, userId, passengers } = req.body;
    res.json({
        message: 'Flight booked successfully',
        bookingId: 'B' + Date.now(),
        status: 'Confirmed'
    });
};
