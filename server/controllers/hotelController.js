// Mock Hotel Data (India Only)
const hotels = [
    {
        id: 'H101',
        name: 'Taj Mahal Palace',
        city: 'Mumbai',
        rating: 5,
        basePrice: 15000,
        amenities: ['Pool', 'Spa', 'Sea View'],
        image: 'https://example.com/taj.jpg'
    },
    {
        id: 'H102',
        name: 'Rambagh Palace',
        city: 'Jaipur',
        rating: 5,
        basePrice: 20000,
        amenities: ['History', 'Garden', 'Luxury'],
        image: 'https://example.com/rambagh.jpg'
    },
    {
        id: 'H103',
        name: 'Lemon Tree Premier',
        city: 'Hyderabad',
        rating: 4,
        basePrice: 4500,
        amenities: ['WiFi', 'Gym', 'Restaurant'],
        image: 'https://example.com/lemontree.jpg'
    }
];

// Get Hotels
exports.getHotels = (req, res) => {
    try {
        const { city } = req.query;
        let results = hotels;

        if (city) {
            results = results.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
        }

        // Dynamic Pricing Logic
        const seasonMultiplier = 1.2; // Mock "Peak Season"

        const enrichedResults = results.map(hotel => ({
            ...hotel,
            pricePerNight: Math.round(hotel.basePrice * seasonMultiplier),
            roomTypes: [
                { type: 'Standard', multiplier: 1, price: Math.round(hotel.basePrice * seasonMultiplier) },
                { type: 'Deluxe', multiplier: 1.5, price: Math.round(hotel.basePrice * seasonMultiplier * 1.5) },
                { type: 'Presidential', multiplier: 3, price: Math.round(hotel.basePrice * seasonMultiplier * 3) }
            ]
        }));

        res.json(enrichedResults);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Book Hotel
exports.bookHotel = (req, res) => {
    const { hotelId, roomType, dates } = req.body;
    res.json({
        message: 'Hotel booked successfully',
        bookingId: 'HB' + Date.now(),
        status: 'Confirmed'
    });
};
