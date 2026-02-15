exports.getTripSuggestions = (req, res) => {
    try {
        const { budget, travelers } = req.body;
        const totalBudget = parseFloat(budget);

        let suggestion = {
            classification: 'Economy',
            flightClass: 'Economy',
            hotelType: 'Standard',
            cabType: 'Auto/Bus',
            destination: 'Goa' // Default
        };

        // Rule-based Logic
        if (totalBudget < 5000) {
            suggestion.classification = 'Budget';
            suggestion.flightClass = 'Economy';
            suggestion.hotelType = 'Standard';
            suggestion.cabType = 'Auto';
            suggestion.destination = 'Jaipur';
        } else if (totalBudget >= 5000 && totalBudget <= 20000) {
            suggestion.classification = 'Premium';
            suggestion.flightClass = 'Premium Economy';
            suggestion.hotelType = 'Deluxe';
            suggestion.cabType = 'Sedan';
            suggestion.destination = 'Kerala';
        } else {
            suggestion.classification = 'Luxury';
            suggestion.flightClass = 'Business';
            suggestion.hotelType = 'Presidential';
            suggestion.cabType = 'SUV';
            suggestion.destination = 'Udaipur';
        }

        res.json({
            message: 'AI Trip Suggestions Generated',
            suggestion,
            estimatedCost: totalBudget * 0.9 // Mock estimate
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
