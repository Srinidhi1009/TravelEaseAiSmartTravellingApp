import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Lock, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import WeatherDashboard from '../components/WeatherDashboard';
import GateDashboard from '../components/GateDashboard';

const TripDashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [activeTrip, setActiveTrip] = useState(null);

    useEffect(() => {
        if (!user) {
            setActiveTrip(null);
            return;
        }

        // Check for active booking
        const bookingKey = `travelEase_bookings_${user.id}`;
        const bookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
        if (bookings.length > 0) {
            const latest = bookings[0];

            // Normalize data for consistency
            const normalized = {
                ...latest,
                // Fallback for travelDate (older bookings used 'date' as booking date)
                date: latest.travelDate || latest.date || new Date().toISOString(),
                // Ensure breakdown structure for components
                breakdown: {
                    ...latest.breakdown,
                    flight: typeof latest.breakdown?.flight === 'object'
                        ? latest.breakdown.flight
                        : { amount: latest.breakdown?.flight || 0, airline: 'IndiGo' }
                }
            };

            setActiveTrip(normalized);
        } else {
            setActiveTrip(null);
        }
    }, [user]);

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{t('dashboard.title')}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{activeTrip ? t('dashboard.subtitle', { destination: activeTrip.destination }) : t('dashboard.locked_desc')}</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weather Card */}
                <div className="relative">
                    <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">{t('dashboard.weather_title')}</h2>
                    <div className={!activeTrip ? "blur-sm pointer-events-none opacity-50" : ""}>
                        <WeatherDashboard tripData={activeTrip} />
                    </div>
                    {!activeTrip && (
                        <div className="absolute inset-x-0 bottom-0 top-12 flex items-center justify-center z-10">
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2">
                                <Lock size={24} className="text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('dashboard.locked_status')}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Gate Card */}
                <div className="relative">
                    <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">{t('dashboard.gate_title')}</h2>
                    <div className={!activeTrip ? "blur-sm pointer-events-none opacity-50" : ""}>
                        <GateDashboard tripData={activeTrip} />
                    </div>
                    {!activeTrip && (
                        <div className="absolute inset-x-0 bottom-0 top-12 flex items-center justify-center z-10">
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2">
                                <Lock size={24} className="text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('dashboard.locked_status')}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Savings Analytics Card */}
                <div className="relative">
                    <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" /> {t('navbar.analytics')}
                    </h2>
                    <motion.div
                        whileHover={activeTrip ? { scale: 1.02 } : {}}
                        onClick={() => activeTrip && navigate('/analytics')}
                        className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl h-full flex flex-col justify-between cursor-pointer group ${!activeTrip ? 'opacity-50 blur-[2px]' : ''}`}
                    >
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{t('dashboard.total_savings')}</p>
                            <h3 className="text-4xl font-bold text-primary">
                                {activeTrip ? `₹${(activeTrip.savings || 1200).toLocaleString('en-IN')}` : '₹0'}
                            </h3>
                        </div>
                        <div className="mt-8">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-primary transition-colors flex items-center gap-2">
                                {t('dashboard.view_analytics')} <ArrowRight size={14} />
                            </span>
                        </div>
                    </motion.div>
                    {!activeTrip && (
                        <div className="absolute inset-x-0 bottom-0 top-12 flex items-center justify-center z-10">
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2">
                                <Lock size={24} className="text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t('dashboard.locked_status')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!activeTrip && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-secondary transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-2"
                    >
                        {t('dashboard.book_to_unlock')} <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TripDashboard;
