// MOCK DATA & GENERATORS (Migrated from Backend)

// Deterministic Distance Calculation (KM)
const getDistance = (c1, c2) => {
    if (!c1 || !c2 || c1 === c2) return 100;
    const str = [c1, c2].sort().join('-');
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash % 1500) + 200; // Return distance between 200 and 1700 KM
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
};

// --- FLIGHTS ---
export const getMockFlights = (params) => {
    const { source, destination, passengers = 1, class: cabinClass = 'Economy' } = params || {};
    const dist = getDistance(source, destination);

    const airlines = ['IndiGo', 'Air India', 'Vistara', 'Akasa Air', 'SpiceJet'];
    const classMultipliers = { 'Economy': 1, 'Premium Economy': 1.6, 'Business': 3, 'First Class': 5 };
    const mult = classMultipliers[cabinClass] || 1;

    return airlines.map((airline, i) => {
        const basePrice = Math.round((dist * 4.5 + 1500) * mult);
        return {
            id: `F-${airline.slice(0, 2)}-${i}`,
            airline,
            flightNumber: `${airline.slice(0, 2)}-${100 + i}`,
            source: source || 'Delhi',
            destination: destination || 'Mumbai',
            departureTime: '2023-11-25T10:00:00',
            arrivalTime: '2023-11-25T12:15:00',
            basePrice: basePrice,
            dynamicPrice: basePrice,
            formattedPrice: formatCurrency(basePrice),
            class: cabinClass,
            gateNumber: `${10 + i}A`,
            gateStatus: 'same'
        };
    });
};

// --- HOTELS ---
const hotelTemplates = [
    { name: 'Heritage Grand', rating: 5, mult: 2.8 },
    { name: 'City Central', rating: 4, mult: 1.5 },
    { name: 'Residency Inn', rating: 3, mult: 0.9 },
    { name: 'Luxury Palace', rating: 5, mult: 4.2 }
];

export const getMockHotels = (params) => {
    const { city } = params || {};
    if (!city) return [];

    const hotelPhotos = [
        '1566073771259-6a8506099945', // Taj
        '1542314831-068cd1dbfeeb', // Palace
        '1571003123894-1f0594d2b5d9', // Modern
        '1518780664697-55e3ad937233'  // Luxury (Fixed)
    ];

    return hotelTemplates.map((t, i) => {
        const base = 3000 * t.mult;
        return {
            id: `H-${city.slice(0, 3)}-${i}`,
            name: `${city} ${t.name}`,
            city,
            rating: t.rating,
            price: Math.round(base),
            amenities: ['WiFi', 'AC', 'Breakfast'],
            image: `https://images.unsplash.com/photo-${hotelPhotos[i]}?auto=format&fit=crop&q=60&w=500`,
            roomTypes: [
                { type: 'Standard', multiplier: 1, price: Math.round(base) },
                { type: 'Deluxe', multiplier: 1.5, price: Math.round(base * 1.5) },
                { type: 'Suite', multiplier: 2.5, price: Math.round(base * 2.5) }
            ]
        };
    });
};

// --- CABS ---
const cabConfigs = [
    { type: 'Bike', model: 'Hero Splendor', base: 40, perKm: 12 },
    { type: 'Auto', model: 'Bajaj RE', base: 60, perKm: 18 },
    { type: 'Sedan', model: 'Swift Dzire', base: 120, perKm: 25 },
    { type: 'SUV', model: 'Innova Crysta', base: 250, perKm: 45 }
];

export const getMockCabs = (params) => {
    const { distance = 15 } = params || {};
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 22 || currentHour < 6;
    const nightSurge = isNight ? 1.25 : 1.0;

    return cabConfigs.map((cab, i) => ({
        id: `C${i}`,
        type: cab.type,
        model: cab.model,
        estimatedPrice: Math.round((cab.base + (cab.perKm * distance)) * nightSurge),
        totalFare: Math.round((cab.base + (cab.perKm * distance)) * nightSurge), // Keep both for safety
        isNightCharge: isNight
    }));
};

// --- WEATHER ---
const conditions = ['Sunny', 'Cloudy', 'Rain', 'Thunderstorm', 'Heatwave', 'Cyclone'];
const getCondition = (month) => {
    if (month >= 6 && month <= 9) return 'Rain';
    if (month >= 4 && month <= 6) return 'Sunny';
    return 'Sunny';
};

export const getMockWeather = (params) => {
    const { city, departureDate } = params || {};
    if (!departureDate) return { message: 'Departure date required' };

    const forecast = [];
    let currentDate = new Date(departureDate);

    for (let i = 0; i < 5; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const month = currentDate.getMonth() + 1;
        let condition = getCondition(month);
        let temp = Math.floor(Math.random() * (45 - 20) + 20);
        let humidity = Math.floor(Math.random() * (90 - 30) + 30);
        let wind = Math.floor(Math.random() * (50 - 5) + 5);
        let alert = false;
        let alertData = null;

        if (Math.random() > 0.7) condition = conditions[Math.floor(Math.random() * conditions.length)];

        if (temp > 40) {
            condition = 'Heatwave';
            alert = true;
            alertData = { severity: 'High', suggestion: 'Stay hydrated.' };
        } else if (condition === 'Thunderstorm') {
            alert = true;
            alertData = { severity: 'Critical', suggestion: 'Possible delays.' };
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

    return { city: city || 'Unknown', forecast };
};

// --- GATE STATUS ---
export const getMockGateStatus = (params) => {
    const { flightId } = params || {};
    const statuses = ['Green', 'Mango Yellow', 'Red'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    let gateData = {
        flightId: flightId || 'F101',
        airline: 'IndiGo',
        airportCode: 'HYD',
        terminal: '1',
        assignedGate: '12A',
        predictedGate: '12A',
        gateStatus: 'same',
        alert: false,
        colorCode: 'Green'
    };

    if (randomStatus === 'Mango Yellow') {
        gateData.gateStatus = 'may-change';
        gateData.predictedGate = '14B';
        gateData.colorCode = 'Mango Yellow';
        gateData.alert = true;
        gateData.message = 'Gate assignment unstable.';
    } else if (randomStatus === 'Red') {
        gateData.gateStatus = 'changed';
        gateData.assignedGate = '12A';
        gateData.predictedGate = '4D';
        gateData.colorCode = 'Red';
        gateData.alert = true;
        gateData.message = 'Gate Changed to 4D!';
    }

    return gateData;
};

// --- AI SUGGESTIONS ---
export const getMockAISuggestions = (data) => {
    const { budget } = data || {};
    const totalBudget = parseFloat(budget) || 10000;

    let suggestion = {
        classification: 'Economy',
        flightClass: 'Economy',
        hotelType: 'Standard',
        cabType: 'Auto/Bus',
        destination: 'Goa'
    };

    if (totalBudget < 5000) {
        suggestion.classification = 'Budget';
        suggestion.destination = 'Jaipur';
    } else if (totalBudget >= 5000 && totalBudget <= 20000) {
        suggestion.classification = 'Premium';
        suggestion.destination = 'Kerala';
        suggestion.flightClass = 'Premium Economy';
    } else {
        suggestion.classification = 'Luxury';
        suggestion.destination = 'Udaipur';
        suggestion.flightClass = 'Business';
    }

    return {
        message: 'AI Suggestions Generated (Mock)',
        suggestion,
        estimatedCost: totalBudget * 0.9
    };
};
