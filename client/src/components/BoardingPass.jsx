import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, Clock, MapPin, User, Download, XCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';

const BoardingPass = ({ booking, onBack, onCancel, onRebook, onDownload }) => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const { tripData, status, id } = booking;
    const flightNumber = booking.flightNumber || tripData?.flightNumber || 'AI-203';
    const airline = booking.airline || tripData?.airline || 'Air India';
    const gate = booking.gate || 'A-12';
    const seat = booking.seat || (tripData?.seats?.length > 0 ? tripData.seats[0] : '14F');
    const boardingTime = booking.boardingTime || '06:15 AM';
    const passengerName = user?.name || booking.passengerName || 'Traveler';

    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
        >
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
                <ChevronLeft size={20} /> {t('my_bookings.back_to_list')}
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col">
                {/* Hero Image Section */}
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-700">
                    {!imgError ? (
                        <img
                            src="https://images.unsplash.com/photo-1483450389192-3d3a06dfefcd?q=80&w=1000&auto=format&fit=crop"
                            alt="Travel"
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end p-8">
                        <div className="flex justify-between items-end w-full">
                            <div>
                                <p className="text-white/70 text-[10px] uppercase tracking-[0.2em] mb-1">{t('my_bookings.boarding_pass')}</p>
                                <h3 className="text-white text-2xl font-black uppercase tracking-tight">{airline}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-white/70 text-[10px] uppercase tracking-[0.2em] mb-1">{t('boarding_pass_labels.flight_no')}</p>
                                <h3 className="text-white text-xl font-bold">{flightNumber}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <MapPin size={16} />
                        <span className="text-sm">{tripData?.source} → {tripData?.destination}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">
                        {tripData?.tripType === 'Round-trip' ? t('planner.options.Round-trip') : t('planner.options.One-way')}
                    </div>
                </div>

                {/* Route Section */}
                <div className="bg-primary px-8 py-6 text-white text-center">
                    <div className="flex justify-between items-center relative gap-4">
                        <div className="text-left">
                            <h2 className="text-4xl font-black mb-1">{tripData?.fromCode || 'BOM'}</h2>
                            <p className="text-[10px] uppercase tracking-wider opacity-70">{tripData?.source || t('boarding_pass_labels.origin')}</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center relative">
                            <div className="w-full border-t-2 border-dashed border-white/20 relative">
                                <motion.div
                                    animate={{
                                        x: [-20, 20],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                >
                                    <Plane className="text-white/40" size={16} />
                                </motion.div>
                                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-primary px-2" size={24} />
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className="text-4xl font-black mb-1">{tripData?.toCode || 'HYD'}</h2>
                            <p className="text-[10px] uppercase tracking-wider opacity-70">{tripData?.destination || t('boarding_pass_labels.destination')}</p>
                        </div>
                    </div>
                </div>

                {/* Ticket Body */}
                <div className="p-8 bg-white dark:bg-slate-800 relative">
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('boarding_pass_labels.passenger')}</p>
                            <p className="font-bold text-gray-800 dark:text-white">{passengerName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('boarding_pass_labels.date')}</p>
                            <p className="font-bold text-gray-800 dark:text-white">{tripData?.travelDate || 'TBD'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('boarding_pass_labels.gate')}</p>
                            <p className="font-bold text-gray-800 dark:text-white">{gate}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('boarding_pass_labels.seat')}</p>
                            <p className="font-bold text-gray-800 dark:text-white">{seat}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('boarding_pass_labels.boarding')}</p>
                            <p className="font-bold text-primary">{boardingTime}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{t('boarding_pass_labels.departure')}</p>
                            <p className="font-bold text-gray-800 dark:text-white">{tripData?.departureTime || '07:00 AM'}</p>
                        </div>
                    </div>

                    {/* Divider with circles */}
                    <div className="relative border-t-2 border-dashed border-gray-100 dark:border-slate-700 my-8">
                        <div className="absolute -left-11 -top-3 w-6 h-6 bg-light dark:bg-slate-900 rounded-full" />
                        <div className="absolute -right-11 -top-3 w-6 h-6 bg-light dark:bg-slate-900 rounded-full" />
                    </div>

                    {/* QR Code Section */}
                    {tripData?.tripType === 'Round-trip' && tripData?.returnDate && (
                        <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-600">
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                                <span className="flex items-center gap-1"><RefreshCw size={10} /> {t('chatbot.labels.return_flight')}</span>
                                <span>{tripData.returnDate}</span>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <div className="text-center">
                                    <div className="font-bold text-gray-800 dark:text-white">{tripData.destination}</div>
                                    <div className="text-[8px] text-gray-400 uppercase">{tripData.toCode || 'HYD'}</div>
                                </div>
                                <div className="flex-1 flex flex-col items-center mx-4">
                                    <div className="w-full border-t border-gray-300 dark:border-slate-500 relative flex justify-center">
                                        <Plane size={12} className="rotate-180 absolute -top-[6.5px] text-gray-400" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-gray-800 dark:text-white">{tripData.source}</div>
                                    <div className="text-[8px] text-gray-400 uppercase">{tripData.fromCode || 'BOM'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-3xl mb-4 border border-gray-100 dark:border-slate-600">
                            {/* Simple SVG QR Simulator */}
                            <svg width="120" height="120" viewBox="0 0 100 100" className="text-gray-800 dark:text-white">
                                <rect width="100" height="100" fill="transparent" />
                                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                                <rect x="35" y="35" width="10" height="10" fill="currentColor" />
                                <rect x="55" y="55" width="20" height="10" fill="currentColor" />
                                <rect x="10" y="40" width="15" height="15" fill="currentColor" />
                                <rect x="75" y="45" width="10" height="25" fill="currentColor" />
                            </svg>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium">{t('boarding_pass_labels.booking_id')}: {id}</p>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onDownload(id)}
                        className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Download size={18} /> {t('my_bookings.download_ticket')}
                    </button>
                    <button
                        onClick={() => onRebook(booking)}
                        className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <RefreshCw size={18} /> {t('my_bookings.rebook_flight')}
                    </button>
                    <button
                        onClick={() => onCancel(id)}
                        className="col-span-2 flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <XCircle size={18} /> {t('my_bookings.cancel_booking')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default BoardingPass;
