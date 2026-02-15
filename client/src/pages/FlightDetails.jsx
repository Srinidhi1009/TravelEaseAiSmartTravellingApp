import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plane, Star, Clock, Calendar, Shield, ThumbsUp, MessageSquare, ArrowRight } from 'lucide-react';

const FlightDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Use passed data
    const passedFlight = location.state?.flight;

    // Mock Flight Data merged with passed data
    const flight = {
        id: id,
        airline: passedFlight?.airline || "Indigo",
        flightNumber: passedFlight?.flightNumber || "6E-554",
        source: passedFlight?.source || "Hyderabad",
        destination: passedFlight?.destination || "Delhi",
        departureTime: "10:00", // Would be nice to verify if passedFlight has this
        arrivalTime: "12:15",
        duration: "2h 15m",
        price: passedFlight ? parseInt(passedFlight.formattedPrice.replace(/[^\d]/g, '')) : 4500,
        rating: 4.2,
        reviews: [
            { user: "Priya M.", rating: 5, text: "On time and very clean aircraft." },
            { user: "John D.", rating: 3, text: "Leg space could be better, but good service." },
            { user: "Ankit R.", rating: 4, text: "Smooth landing and polite crew." }
        ]
    };

    const handleBook = () => {
        // Prepare data for payment flow
        const tripData = {
            source: flight.source,
            destination: flight.destination,
            date: new Date().toISOString().split('T')[0], // Default to today for mock
            passengers: 1,
            // ... other flight details
        };
        const prices = { total: flight.price, flight: flight.price, hotel: 0, cab: 0 };

        navigate('/payment', { state: { tripData, prices } });
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 group flex items-center gap-1 transition-colors">
                &larr; Back to Search
            </button>

            {/* Flight Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 mb-8 transition-colors">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                {flight.airline} <span className="text-lg opacity-80 font-normal">{flight.flightNumber}</span>
                            </h1>
                            <p className="opacity-90 mt-2 flex items-center gap-2">
                                {flight.source} <ArrowRight size={16} /> {flight.destination}
                            </p>
                        </div>
                        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl flex flex-col items-center">
                            <span className="text-sm opacity-80">Price</span>
                            <span className="text-2xl font-bold">₹{flight.price.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8 bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600">
                        <div className="text-center">
                            <div className="text-2xl font-bold dark:text-white">{flight.departureTime}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{flight.source}</div>
                        </div>
                        <div className="flex-1 px-8 flex flex-col items-center">
                            <div className="text-xs text-gray-400 dark:text-gray-500 font-bold mb-1">{flight.duration}</div>
                            <div className="w-full h-0.5 bg-gray-300 dark:bg-slate-600 relative">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 dark:bg-slate-800 p-1 rounded-full">
                                    <Plane size={16} className="text-blue-500 transform rotate-90" />
                                </div>
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-bold mt-1">Non-stop</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold dark:text-white">{flight.arrivalTime}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{flight.destination}</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={handleBook} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
                            Book Flight Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                    <MessageSquare className="text-blue-500" />
                    Passenger Reviews
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flight.reviews.map((review, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="font-bold text-gray-800 dark:text-white">{review.user}</div>
                                <div className="flex bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold gap-1">
                                    {review.rating} <Star size={10} fill="currentColor" />
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlightDetails;
