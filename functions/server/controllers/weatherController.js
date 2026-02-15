// Mock Weather Data Generator
const conditions = ['Sunny', 'Cloudy', 'Rain', 'Thunderstorm', 'Heatwave', 'Cyclone'];

const getCondition = (month) => {
    // Simple season logic for India
    if (month >= 6 && month <= 9) return 'Rain'; // Monsoon
    if (month >= 4 && month <= 6) return 'Sunny'; // Summer
    return 'Sunny'; // Winter/Spring
};

const generateForecast = (startDate, days) => {
    const forecast = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < days; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const month = currentDate.getMonth() + 1;

        let condition = getCondition(month);
        let temp = Math.floor(Math.random() * (45 - 20) + 20); // 20-45 C
        let humidity = Math.floor(Math.random() * (90 - 30) + 30);
        let wind = Math.floor(Math.random() * (50 - 5) + 5);
        let alert = false;
        let alertData = null;

        // Randomize condition slightly
        if (Math.random() > 0.7) condition = conditions[Math.floor(Math.random() * conditions.length)];

        // Alert Logic
        if (temp > 40) {
            condition = 'Heatwave';
            alert = true;
            alertData = { severity: 'High', suggestion: 'Stay hydrated and avoid outdoors.' };
        } else if (condition === 'Thunderstorm' || condition === 'Cyclone') {
            alert = true;
            alertData = { severity: 'Critical', suggestion: 'Flight delays possible. Check status.' };
        } else if (condition === 'Rain' && Math.random() > 0.8) {
            alert = true;
            alertData = { severity: 'Medium', suggestion: 'Heavy rains expected.' };
        }

        forecast.push({
            date: dateStr,
            temperature: temp,
            condition,
            humidity,
            windSpeed: wind,
            alert,
            alertDetails: alertData
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }
    return forecast;
};

exports.getWeather = (req, res) => {
    try {
        const { city, departureDate, returnDate, tripType } = req.query;
        if (!departureDate) return res.status(400).json({ message: 'Departure date required' });

        // Logic: Generate weather for requested period
        // For simplicity in mock, just generate 5 days from departure
        const forecast = generateForecast(departureDate, 5);

        res.json({
            city: city || 'Unknown',
            forecast
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
