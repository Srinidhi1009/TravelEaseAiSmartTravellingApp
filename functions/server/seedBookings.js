const { db } = require('./config/firebase-config');

const bookings = [
    {
        userId: 'guest',
        airline: 'Indigo',
        flightNumber: '6E-451',
        status: 'Confirmed',
        tripData: {
            source: 'Mumbai',
            destination: 'Hyderabad',
            fromCode: 'BOM',
            toCode: 'HYD',
            travelDate: '2026-01-21',
            departureTime: '07:00 AM'
        },
        passengerName: 'John Doe',
        gate: 'A-12',
        seat: '14F',
        boardingTime: '06:15 AM',
        createdAt: new Date().toISOString()
    },
    {
        userId: 'guest',
        airline: 'Air India',
        flightNumber: 'AI-203',
        status: 'Confirmed',
        tripData: {
            source: 'Chennai',
            destination: 'Delhi',
            fromCode: 'MAA',
            toCode: 'DEL',
            travelDate: '2026-01-25',
            departureTime: '09:30 AM'
        },
        passengerName: 'John Doe',
        gate: 'C-04',
        seat: '22A',
        boardingTime: '08:45 AM',
        createdAt: new Date().toISOString()
    },
    {
        userId: 'guest',
        airline: 'Vistara',
        flightNumber: 'UK-812',
        status: 'Confirmed',
        tripData: {
            source: 'Bangalore',
            destination: 'Kolkata',
            fromCode: 'BLR',
            toCode: 'CCU',
            travelDate: '2026-01-28',
            departureTime: '11:15 AM'
        },
        passengerName: 'John Doe',
        gate: 'B-09',
        seat: '05C',
        boardingTime: '10:30 AM',
        createdAt: new Date().toISOString()
    },
    {
        userId: 'guest',
        airline: 'SpiceJet',
        flightNumber: 'SG-105',
        status: 'Confirmed',
        tripData: {
            source: 'Hyderabad',
            destination: 'Mumbai',
            fromCode: 'HYD',
            toCode: 'BOM',
            travelDate: '2026-02-02',
            departureTime: '04:45 PM'
        },
        passengerName: 'John Doe',
        gate: 'G-11',
        seat: '18E',
        boardingTime: '04:00 PM',
        createdAt: new Date().toISOString()
    },
    {
        userId: 'guest',
        airline: 'Akasa Air',
        flightNumber: 'QP-1102',
        status: 'Confirmed',
        tripData: {
            source: 'Delhi',
            destination: 'Chennai',
            fromCode: 'DEL',
            toCode: 'MAA',
            travelDate: '2026-02-10',
            departureTime: '02:00 PM'
        },
        passengerName: 'John Doe',
        gate: 'T3-12',
        seat: '10B',
        boardingTime: '01:15 PM',
        createdAt: new Date().toISOString()
    }
];

async function seed() {
    try {
        for (const b of bookings) {
            const res = await db.collection('bookings').add(b);
            console.log('Added booking:', res.id);
        }
        console.log('Seed successful');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();
