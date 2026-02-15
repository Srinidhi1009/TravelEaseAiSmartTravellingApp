import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Ticket, RefreshCw, Plane, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { getUserBookings, cancelBooking, rebookFlight } from '../services/api';
import BoardingPass from '../components/BoardingPass';

const MyBookings = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuthContext(); // Use reactive auth context
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.id) fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await getUserBookings(user.id);
            // Deduplicate bookings based on trip details to prevent double submissions from showing
            const uniqueBookings = [];
            const seen = new Set();

            res.data.forEach(booking => {
                const key = `${booking.tripData?.source}-${booking.tripData?.destination}-${booking.tripData?.travelDate}-${booking.tripData?.departureTime}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueBookings.push(booking);
                }
            });

            setBookings(uniqueBookings);
            setError(null);
        } catch (err) {
            console.error("Fetch bookings error:", err);
            setError(t('my_bookings.error_load'));
            // Fallback for demo if backend is not fully ready/mocked
            const bookingKey = `travelEase_bookings_${user.id}`;
            const savedBookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');

            // Also deduplicate fallback data
            const uniqueBookings = [];
            const seen = new Set();
            savedBookings.forEach(booking => {
                const key = `${booking.tripData?.source}-${booking.tripData?.destination}-${booking.tripData?.travelDate}-${booking.tripData?.departureTime}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueBookings.push(booking);
                }
            });
            setBookings(uniqueBookings);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm(t('my_bookings.confirm_cancel'))) return;
        try {
            await cancelBooking(id);
            // Re-fetch or update local state
            fetchBookings();
            setSelectedBooking(null);
            alert(t('my_bookings.cancel_success'));
        } catch (err) {
            alert(t('my_bookings.cancel_fail'));
        }
    };

    const handleRebook = async (booking) => {
        const currentTravelDate = booking.tripData?.travelDate || booking.travelDate || '';
        const newDate = window.prompt(t('my_bookings.prompt_rebook'), currentTravelDate);
        if (!newDate) return;

        try {
            await rebookFlight(booking.id, {
                travelDate: newDate,
                departureTime: '10:30 AM', // Simulate change
                status: 'Rebooked'
            });
            fetchBookings();
            setSelectedBooking(null);
            alert(t('my_bookings.rebook_success'));
        } catch (err) {
            alert(t('my_bookings.rebook_fail'));
        }
    };

    const handleDownload = (id) => {
        alert(t('my_bookings.downloading'));
        const data = "Digital Ticket Content for Booking " + id;
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Ticket_${id}.txt`;
        a.click();
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            case 'rebooked': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (selectedBooking) {
        return (
            <div className="pt-24 pb-12 px-4 min-h-screen bg-light dark:bg-slate-900 transition-colors">
                <BoardingPass
                    booking={selectedBooking}
                    onBack={() => setSelectedBooking(null)}
                    onCancel={handleCancel}
                    onRebook={handleRebook}
                    onDownload={handleDownload}
                />
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto min-h-screen">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <Ticket size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 dark:text-white tracking-tight">{t('my_bookings.title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('my_bookings.subtitle')}</p>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="text-primary mb-4"
                    >
                        <RefreshCw size={40} />
                    </motion.div>
                    <p className="text-gray-400 font-medium tracking-wide">{t('my_bookings.loading')}</p>
                </div>
            ) : bookings.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-16 text-center border border-gray-100 dark:border-slate-700 shadow-xl"
                >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Plane size={48} className="text-gray-200 dark:text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('my_bookings.no_bookings')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
                        {t('my_bookings.empty_desc')}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                    >
                        {t('my_bookings.book_now')}
                    </button>
                </motion.div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking, idx) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedBooking(booking)}
                            className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
                        >
                            <div className="flex items-center gap-6 w-full md:w-auto mb-6 md:mb-0">
                                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                    <Plane className="text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors" size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                                            {booking.flightNumber || 'AI-203'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(booking.status)}`}>
                                            {t(`my_bookings.status_${(booking.status || 'confirmed').toLowerCase()}`)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        {booking.tripData?.source || t('boarding_pass_labels.origin')}
                                        <ChevronRight size={16} className="text-gray-300 dark:text-gray-500" />
                                        {booking.tripData?.destination || t('boarding_pass_labels.destination')}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-center md:text-right">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1 justify-center md:justify-end">
                                        <Calendar size={14} />
                                        <span className="text-xs font-medium">{booking.tripData?.travelDate || t('my_bookings.date_tbd')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-end">
                                        <Clock size={14} />
                                        <span className="text-xs font-medium">{booking.tripData?.departureTime || '07:00 AM'}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl text-gray-300 dark:text-gray-500 group-hover:bg-primary group-hover:text-white transition-all">
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
