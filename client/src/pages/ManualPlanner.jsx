import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Hotel, Car, ArrowRight, CheckCircle, ArrowLeftRight, AlertCircle, Star, Bed, Armchair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchFlights, searchHotels, searchCabs } from '../services/api';
import SeatMap from '../components/SeatMap';
import CityDropdown from '../components/CityDropdown';
import FareBreakdown from '../components/FareBreakdown';

const ManualPlanner = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [showSeatMap, setShowSeatMap] = useState(false);
    const [errors, setErrors] = useState({});

    const [tripData, setTripData] = useState({
        source: '', destination: '', date: '', returnDate: '',
        tripType: 'One-way', passengers: 1, class: 'Economy',
        timeSlot: '', seats: [], selectedHotelId: null,
        roomType: 'Standard', cabType: '', vehicleModel: '',
        meal: 'No Preference', baggage: '15kg', refundable: false
    });

    const [prices, setPrices] = useState({ flight: 0, hotel: 0, cab: 0, total: 0, breakdown: [] });

    const [availableHotels, setAvailableHotels] = useState([]);
    const [availableCabs, setAvailableCabs] = useState([]);

    // Fetch Hotels
    useEffect(() => {
        const fetchHotels = async () => {
            if (tripData.destination) {
                try {
                    const res = await searchHotels({ city: tripData.destination });
                    setAvailableHotels(res.data);
                } catch (e) {
                    console.error("Hotel search failed", e);
                }
            }
        };
        fetchHotels();
    }, [tripData.destination]);

    // Fetch Cabs
    useEffect(() => {
        const fetchCabs = async () => {
            try {
                const res = await searchCabs({ type: 'All', distance: 25 }); // 25km avg
                setAvailableCabs(res.data);
            } catch (e) {
                console.error("Cab search failed", e);
            }
        };
        fetchCabs();
    }, [tripData.destination]);


    // Helper for flight pricing (matches mockData.js logic)
    const getFlightPrice = () => {
        if (!tripData.source || !tripData.destination) return 5000;
        const str = [tripData.source, tripData.destination].sort().join('-');
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        const dist = Math.abs(hash % 1500) + 200;

        const classMultipliers = { 'Economy': 1, 'Premium Economy': 1.6, 'Business': 3, 'First Class': 5 };
        const mult = classMultipliers[tripData.class] || 1;

        let base = (dist * 4.5 + 1500) * mult;
        if (tripData.tripType === 'Round-trip') base *= 1.8;

        // Add Preferences
        if (tripData.refundable) base += 1500;
        if (tripData.meal !== 'No Preference') base += 500;

        // Baggage Pricing
        const bagPrice = tripData.baggage === '25kg' ? 1500 : tripData.baggage === '5kg' ? -500 : 0;
        base += bagPrice;

        return Math.round(base * tripData.passengers);
    };

    useEffect(() => {
        let br = [];

        const f = getFlightPrice();
        br.push({ label: t('manual_planner.flight_details'), amount: f });

        let h = 0;
        if (tripData.selectedHotelId) {
            const hotel = availableHotels.find(x => x.id === tripData.selectedHotelId);
            const room = hotel?.roomTypes?.find(r => r.type === tripData.roomType) || hotel?.roomTypes?.[0];
            h = (room?.price || hotel?.price || 0) * tripData.passengers; // Scale hotel by passengers too for realism
            br.push({ label: t('manual_planner.select_hotel'), amount: Math.round(h) });
        }

        let c = 0;
        if (tripData.cabType) {
            const cab = availableCabs.find(c => c.type === tripData.cabType);
            c = cab ? Math.round(cab.estimatedPrice || cab.totalFare || 0) : 0;
            br.push({ label: t('manual_planner.airport_transfer'), amount: c });
        }

        setPrices({
            flight: f,
            hotel: h,
            cab: c,
            total: f + h + c,
            breakdown: br
        });
    }, [tripData, availableHotels, availableCabs, t]);

    const validate = () => {
        const e = {};
        if (!tripData.source) e.source = t('manual_planner.errors.origin_req');
        if (!tripData.destination) e.destination = t('manual_planner.errors.dest_req');
        if (!tripData.date) e.date = t('manual_planner.errors.dep_req');
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    return (
        <div className={`pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen bg-light dark:bg-slate-900 ${i18n.language === 'ur' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">{t('manual_planner.title')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('manual_planner.subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* FLIGHT */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <Plane /> <h2 className="text-xl font-bold">{t('manual_planner.flight_details')}</h2>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                                {['One-way', 'Round-trip'].map(x => (
                                    <button key={x} onClick={() => setTripData({ ...tripData, tripType: x })} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${tripData.tripType === x ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {t(`planner.options.${x}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end mb-6">
                            <div className="md:col-span-5">
                                <CityDropdown label={t('manual_planner.flying_from')} value={tripData.source} onChange={v => setTripData({ ...tripData, source: v })} placeholder={t('manual_planner.select_origin')} />
                                {errors.source && <span className="text-red-500 text-xs">{errors.source}</span>}
                            </div>
                            <div className="md:col-span-1 flex justify-center mb-2">
                                <button onClick={() => setTripData(p => ({ ...p, source: p.destination, destination: p.source }))} className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"><ArrowLeftRight size={18} /></button>
                            </div>
                            <div className="md:col-span-5">
                                <CityDropdown label={t('manual_planner.flying_to')} value={tripData.destination} onChange={v => setTripData({ ...tripData, destination: v })} placeholder={t('manual_planner.select_dest')} />
                                {errors.destination && <span className="text-red-500 text-xs">{errors.destination}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('manual_planner.departure')}</label>
                                <input type="date" className="w-full p-4 bg-gray-50 dark:bg-slate-700 dark:text-white rounded-xl font-bold border-none focus:ring-2 focus:ring-blue-500" value={tripData.date} onChange={e => setTripData({ ...tripData, date: e.target.value })} />
                            </div>
                            {tripData.tripType === 'Round-trip' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('manual_planner.return')}</label>
                                    <input type="date" className="w-full p-4 bg-gray-50 dark:bg-slate-700 dark:text-white rounded-xl font-bold border-none focus:ring-2 focus:ring-blue-500" value={tripData.returnDate} onChange={e => setTripData({ ...tripData, returnDate: e.target.value })} />
                                </div>
                            )}
                            <div className={tripData.tripType === 'Round-trip' ? '' : 'md:col-span-2'}>
                                <div className="flex items-center bg-gray-50 dark:bg-slate-700 rounded-xl p-2 gap-4">
                                    <button className="w-10 h-10 bg-white dark:bg-slate-600 dark:text-white rounded-lg shadow font-bold hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors" onClick={() => setTripData(p => ({ ...p, passengers: Math.max(1, p.passengers - 1) }))}>-</button>
                                    <span className="flex-1 text-center font-bold text-xl text-gray-800 dark:text-white">{tripData.passengers}</span>
                                    <button className="w-10 h-10 bg-white dark:bg-slate-600 dark:text-white rounded-lg shadow font-bold hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors" onClick={() => setTripData(p => ({ ...p, passengers: Math.min(9, p.passengers + 1) }))}>+</button>
                                </div>
                            </div>
                        </div>

                        {/* Seats and Preferences UI */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('manual_planner.seating')}</label>
                                <button
                                    onClick={() => setShowSeatMap(true)}
                                    className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl border-2 border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                                >
                                    <div className="flex items-center gap-3 font-bold">
                                        <Armchair size={20} />
                                        {tripData.seats.length > 0 ? tripData.seats.join(', ') : t('manual_planner.select_seats')}
                                    </div>
                                    <ArrowRight size={18} />
                                </button>
                                {tripData.seats.length > 0 && tripData.seats.length !== tripData.passengers && (
                                    <p className="text-orange-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> {t('manual_planner.seat_mismatch', { count: tripData.passengers })}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('manual_planner.class')}</label>
                                <select
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 dark:text-white rounded-xl font-bold border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={tripData.class}
                                    onChange={(e) => setTripData({ ...tripData, class: e.target.value })}
                                >
                                    {['Economy', 'Premium Economy', 'Business', 'First Class'].map(x => (
                                        <option key={x} value={x}>{t(`planner.options.${x}`)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('manual_planner.meal_pref')}</label>
                                <select
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 dark:text-white rounded-xl font-bold border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={tripData.meal}
                                    onChange={(e) => setTripData({ ...tripData, meal: e.target.value })}
                                >
                                    {['No Preference', 'Veg', 'Non-Veg', 'Jain', 'Vegan'].map(x => (
                                        <option key={x} value={x}>{t(`planner.options.${x}`)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-blue-600 dark:text-blue-400">
                                        <CheckCircle size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 dark:text-white">{t('manual_planner.refundable')}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{t('manual_planner.flexible_cancellation')}</div>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 rounded-md text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600"
                                    checked={tripData.refundable}
                                    onChange={(e) => setTripData({ ...tripData, refundable: e.target.checked })}
                                />
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl relative overflow-hidden">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('manual_planner.baggage_allowance')}</label>
                                <div className="flex gap-2">
                                    {['5kg', '15kg', '25kg'].map(w => (
                                        <button
                                            key={w}
                                            onClick={() => setTripData({ ...tripData, baggage: w })}
                                            className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold border-2 transition-all ${tripData.baggage === w ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : 'border-gray-200 dark:border-slate-600 text-gray-500 hover:border-blue-200'}`}
                                        >
                                            {w}
                                            <div className="text-[10px] opacity-60 font-medium">
                                                {w === '5kg' ? t('manual_planner.less_rate') : w === '25kg' ? t('manual_planner.more_price') : t('manual_planner.standard')}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HOTEL */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                <Hotel /> <h2 className="text-xl font-bold">{t('manual_planner.select_hotel')}</h2>
                            </div>
                            {tripData.selectedHotelId && (
                                <select className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg text-sm font-bold text-purple-900 dark:text-purple-300 border-none outline-none focus:ring-2 focus:ring-purple-500" value={tripData.roomType} onChange={e => setTripData({ ...tripData, roomType: e.target.value })}>
                                    {['Standard', 'Deluxe', 'Suite'].map(x => <option key={x} value={x}>{t(`manual_planner.room_types.${x}`)}</option>)}
                                </select>
                            )}
                        </div>
                        {tripData.destination ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableHotels.map(h => (
                                    <div key={h.id} onClick={() => setTripData({ ...tripData, selectedHotelId: h.id })} className={`flex gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${tripData.selectedHotelId === h.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700'}`}>
                                        <img src={h.image} className="w-20 h-20 rounded-lg object-cover" alt="" />
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-gray-800 dark:text-white">{h.name}</div>
                                            <div className="flex items-center gap-1 text-yellow-500 text-xs"><Star size={10} fill="currentColor" /> {h.rating || 4.5}</div>
                                            <div className="font-bold text-lg text-gray-800 dark:text-white">
                                                ₹{(h.roomTypes?.find(r => r.type === tripData.roomType)?.price || h.price).toLocaleString('en-IN')}
                                                <span className="text-[10px] font-normal text-gray-400 block -mt-1">{t('manual_planner.per_night')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="text-center text-gray-400 dark:text-gray-500 py-8 bg-gray-50 dark:bg-slate-700/50 rounded-xl border-2 border-dashed dark:border-slate-600">{t('manual_planner.select_dest')}</div>}
                    </div>

                    {/* CAB */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6 text-orange-600 dark:text-orange-400"><Car /> <h2 className="text-xl font-bold">{t('manual_planner.airport_transfer')}</h2></div>
                        <div className="flex gap-4">
                            {availableCabs.map(x => (
                                <button key={x.id} onClick={() => setTripData({ ...tripData, cabType: x.type })} className={`flex-1 py-3 px-2 rounded-xl font-bold border-2 transition-all flex flex-col items-center gap-1 ${tripData.cabType === x.type ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-orange-200 dark:hover:border-orange-700'}`}>
                                    <span className="text-xs uppercase opacity-60 tracking-tighter">{x.type}</span>
                                    <span className="text-sm font-black">{x.model}</span>
                                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">₹{Math.round(x.estimatedPrice || x.totalFare || 0)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-slate-700 sticky top-28">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{t('manual_planner.trip_summary')}</h2>
                        <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between"><span>{t('manual_planner.flight_details')}</span><span className="font-bold">₹{prices.flight.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span>{t('manual_planner.select_hotel')}</span><span className="font-bold">₹{prices.hotel.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span>{t('manual_planner.airport_transfer')}</span><span className="font-bold">₹{prices.cab.toLocaleString('en-IN')}</span></div>
                        </div>
                        <div className="border-t border-dashed dark:border-slate-600 pt-4 mb-6">
                            <div className="flex justify-between items-center text-3xl font-bold text-gray-900 dark:text-white"><span>{t('manual_planner.total')}</span><span>₹{prices.total.toLocaleString('en-IN')}</span></div>
                            <div className="text-xs text-gray-400 text-right mt-1">{t('manual_planner.gst_notice')}</div>
                        </div>
                        <button onClick={() => navigate('/payment', { state: { tripData, prices, bookingType: 'Manual' } })} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                            {t('manual_planner.proceed_pay')} <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>
            <SeatMap isOpen={showSeatMap} onClose={() => setShowSeatMap(false)} onConfirm={s => { setTripData({ ...tripData, seats: s }); setShowSeatMap(false); }} travelers={tripData.passengers} />
        </div >
    );
};

export default ManualPlanner;
