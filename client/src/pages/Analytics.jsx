import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Lock, TrendingUp, DollarSign, Award, ArrowRight, History, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';

const Analytics = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user } = useAuthContext();
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        if (user) {
            // Load bookings from storage with user isolation
            const bookingKey = `travelEase_bookings_${user.id}`;
            const storedBookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
            if (storedBookings.length > 0) {
                setBookings(storedBookings);

                // Try to load previously selected trip for sync
                const lastSelectedId = localStorage.getItem(`travelEase_activeTrip_${user.id}`);
                const found = storedBookings.find(b => b.id === lastSelectedId);
                setSelectedBooking(found || storedBookings[0]);
            }
        }
    }, [user]);

    // Instant sync listener
    useEffect(() => {
        const handleSync = () => {
            const lastSelectedId = localStorage.getItem(`travelEase_activeTrip_${user?.id}`);
            const found = bookings.find(b => b.id === lastSelectedId);
            if (found) setSelectedBooking(found);
        };
        window.addEventListener('travelEaseTripSync', handleSync);
        return () => window.removeEventListener('travelEaseTripSync', handleSync);
    }, [bookings, user]);

    if (bookings.length === 0) {
        return (
            <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen flex items-center justify-center bg-light dark:bg-slate-900 transition-colors">
                <div className="text-center max-w-lg bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={40} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{t('analytics_page.locked_title')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                        {t('analytics_page.locked_desc')}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary transition-colors inline-flex items-center gap-2"
                    >
                        {t('analytics_page.book_now')} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedBooking) return null;

    // Generate Dynamic Comparison Data based on current selection
    const generateComparison = (basePrice, type) => {
        if (!basePrice || basePrice === 0) return [];

        let multiplier = 1.0;
        const data = [];

        // TravelEase (Base)
        data.push({ name: 'TravelEase', price: basePrice, fill: '#2563eb' });

        // Competitors logic
        if (type === 'flight') {
            data.push({ name: 'MakeMyTrip', price: Math.round(basePrice * 1.15), fill: '#94a3b8' });
            data.push({ name: 'Goibibo', price: Math.round(basePrice * 1.12), fill: '#94a3b8' });
            data.push({ name: 'Yatra', price: Math.round(basePrice * 1.18), fill: '#94a3b8' });
        } else if (type === 'hotel') {
            data.push({ name: 'MakeMyTrip', price: Math.round(basePrice * 1.25), fill: '#94a3b8' });
            data.push({ name: 'Agoda', price: Math.round(basePrice * 1.22), fill: '#94a3b8' });
            data.push({ name: 'Booking.com', price: Math.round(basePrice * 1.30), fill: '#94a3b8' });
        } else if (type === 'cab') {
            data.push({ name: 'Ola', price: Math.round(basePrice * 1.40), fill: '#94a3b8' });
            data.push({ name: 'Uber', price: Math.round(basePrice * 1.35), fill: '#94a3b8' });
            data.push({ name: 'Rapido', price: Math.round(basePrice * 1.25), fill: '#94a3b8' });
        }

        return data;
    };

    const flightData = generateComparison(selectedBooking.breakdown?.flight, 'flight');
    const hotelData = generateComparison(selectedBooking.breakdown?.hotel, 'hotel');
    const cabData = generateComparison(selectedBooking.breakdown?.cab, 'cab');

    // Calculate Dynamic Savings (Total Competitor Average - Our Price)
    const calculateSavings = () => {
        let totalCompetitor = 0;
        let count = 0;
        [flightData, hotelData, cabData].flat().forEach(item => {
            if (item.name !== 'TravelEase') {
                totalCompetitor += item.price;
                count++;
            }
        });
        const avgCompetitor = count > 0 ? totalCompetitor / (count / 3) : 0; // Rough approx
        // Better: Sum of differences
        let saved = 0;
        if (flightData.length) saved += (flightData[1].price - flightData[0].price);
        if (hotelData.length) saved += (hotelData[1].price - hotelData[0].price);
        if (cabData.length) saved += (cabData[1].price - cabData[0].price);
        return saved > 0 ? saved : selectedBooking.savings || 1200;
    };

    const currentSavings = calculateSavings();
    const source = selectedBooking.source || selectedBooking.tripData?.source || '';
    const destination = selectedBooking.destination || selectedBooking.tripData?.destination || '';
    const totalPrice = selectedBooking.totalPrice || 0;

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto bg-light dark:bg-slate-900 min-h-screen transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-gray-800 dark:text-white">
                        <TrendingUp className="text-green-600 dark:text-green-400" /> {t('analytics_page.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">{t('analytics_page.subtitle')}</p>
                </div>

                {/* Booking Selector */}
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                    <History size={18} className="text-gray-400 ml-2" />
                    <select
                        className="bg-transparent font-bold text-gray-700 dark:text-white outline-none cursor-pointer py-2 pr-4 custom-select"
                        value={selectedBooking.id}
                        onChange={(e) => {
                            const booking = bookings.find(b => b.id === e.target.value);
                            setSelectedBooking(booking);
                            localStorage.setItem(`travelEase_activeTrip_${user.id}`, booking.id);
                            window.dispatchEvent(new Event('travelEaseTripSync'));
                        }}
                    >
                        {bookings.map(b => {
                            const bookingDate = b.date || b.bookingDate || b.tripData?.travelDate || b.createdAt;
                            const source = b.source || b.tripData?.source || '';
                            const destination = b.destination || b.tripData?.destination || '';
                            const type = b.type || 'Manual';

                            return (
                                <option key={b.id} value={b.id} className="text-gray-800">
                                    {(bookingDate && !isNaN(new Date(bookingDate))) ? new Date(bookingDate).toLocaleDateString(i18n.language) : t('my_bookings.date_tbd')} - {source} → {destination} ({t(`analytics_page.${type.toLowerCase()}`, { defaultValue: type })})
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Savings Hero Card */}
            <motion.div
                key={selectedBooking.id} // Re-animate on change
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-500 to-emerald-700 dark:from-green-600 dark:to-emerald-800 rounded-3xl p-8 text-white shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between"
            >
                <div>
                    <div className="flex items-center gap-2 opacity-80 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">{t('analytics_page.trip')}: {source} → {destination}</span>
                    </div>
                    <h2 className="text-2xl font-bold opacity-90 mb-2">{t('analytics_page.total_savings')}</h2>
                    <div className="text-6xl font-bold flex items-center gap-2">
                        ₹{currentSavings.toLocaleString('en-IN')} <Award className="text-yellow-300" size={48} />
                    </div>
                    <p className="mt-4 bg-white/20 inline-block px-4 py-1 rounded-full text-sm backdrop-blur-sm">
                        {t('analytics_page.you_paid', { price: totalPrice.toLocaleString('en-IN') })} {t('analytics_page.vs_competitors', { total: (totalPrice + currentSavings).toLocaleString('en-IN') })}
                    </p>
                </div>
                <div className="hidden md:block">
                    <TrendingUp size={120} className="text-white opacity-20" />
                </div>
            </motion.div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Flight Comparison */}
                {selectedBooking.breakdown?.flight > 0 && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                            {t('analytics_page.best_price_flights')}
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={flightData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value}`, t('analytics_page.price_label')]}
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Hotel Comparison */}
                {selectedBooking.breakdown?.hotel > 0 && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                            {t('analytics_page.best_price_hotels')}
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hotelData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value}`, t('analytics_page.price_label')]}
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Cab Comparison */}
                {selectedBooking.breakdown?.cab > 0 && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                            {t('analytics_page.best_price_cabs')}
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cabData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value}`, t('analytics_page.price_label')]}
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
