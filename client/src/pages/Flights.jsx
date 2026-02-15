import React, { useState, useEffect } from 'react';
import { Search, Plane, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchFlights } from '../services/api';

const Flights = () => {
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load some initial data
        loadFlights();
    }, []);

    const loadFlights = async () => {
        setLoading(true);
        try {
            // Mock call - in real app would use params
            const res = await searchFlights();
            setFlights(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 dark:text-white">Search Flights</h2>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row gap-4 transition-colors">
                <input type="text" placeholder="From (e.g. Delhi)" className="flex-1 p-3 border rounded-xl bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="text" placeholder="To (e.g. Mumbai)" className="flex-1 p-3 border rounded-xl bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="date" className="flex-1 p-3 border rounded-xl bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                <button className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-secondary transition-colors font-semibold flex items-center gap-2">
                    <Search size={20} /> Search
                </button>
            </div>

            {/* Results */}
            <div className="space-y-4">
                {flights.map(flight => (
                    <div
                        key={flight.id}
                        onClick={() => navigate(`/flights/${flight.id}`, { state: { flight } })}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Plane size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg dark:text-white">{flight.airline} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{flight.flightNumber}</span></h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{flight.source} → {flight.destination}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">4.2 (Verified)</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-dark dark:text-white">{flight.formattedPrice}</p>
                            <p className="text-xs text-red-500 dark:text-red-400 font-medium">Get {flight.discount || '10%'} off with UPI</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Direct booking flow
                                    navigate('/payment', {
                                        state: {
                                            tripData: { source: flight.source, destination: flight.destination, date: '2026-02-16', passengers: 1 },
                                            prices: { total: parseInt(flight.formattedPrice.replace(/[^\d]/g, '')), flight: parseInt(flight.formattedPrice.replace(/[^\d]/g, '')), hotel: 0, cab: 0 }
                                        }
                                    });
                                }}
                                className="mt-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-black dark:hover:bg-gray-100 transition-colors"
                            >
                                Book Flight Only
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Flights;
