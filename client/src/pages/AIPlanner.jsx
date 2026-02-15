import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Plane, Hotel, Car, CreditCard, Loader2, RefreshCcw, AlertTriangle, X, Smartphone, Globe, Landmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';

const AIPlanner = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuthContext();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentData, setPaymentData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Comprehensive City Data
    const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Goa", "Kochi", "Lucknow", "Guwahati", "Chandigarh", "Srinagar", "Patna", "Ranchi", "Bhubaneswar", "Indore", "Bhopal", "Visakhapatnam", "Nagpur", "Vadodara", "Coimbatore", "Madurai", "Varanasi", "Amritsar", "Shimla", "Dehradun", "Thiruvananthapuram"];

    const cityData = {
        'Delhi': { code: 'DEL', tier: 1.4 }, 'Mumbai': { code: 'BOM', tier: 1.5 },
        'Hyderabad': { code: 'HYD', tier: 1.3 }, 'Bangalore': { code: 'BLR', tier: 1.4 },
        'Chennai': { code: 'MAA', tier: 1.3 }, 'Kolkata': { code: 'CCU', tier: 1.2 },
    };

    const questions = [
        { id: 1, text: t('planner.questions.budget'), key: "budget", type: "number", placeholder: "e.g. 25000" },
        { id: 2, text: t('planner.questions.tripType'), key: "tripType", type: "option", options: ["One-way", "Round-trip"] },
        { id: 3, text: t('planner.questions.source'), key: "source", type: "search", placeholder: "e.g. Delhi", list: "cities" },
        { id: 4, text: t('planner.questions.destination'), key: "destination", type: "search", placeholder: "e.g. Goa", list: "cities" },
        { id: 5, text: t('planner.questions.departureDate'), key: "departureDate", type: "date" },
        { id: 6, text: t('planner.questions.returnDate'), key: "returnDate", type: "date", condition: (data) => data.tripType === "Round-trip" },
        { id: 7, text: t('planner.questions.travelers'), key: "travelers", type: "number", placeholder: "1" },
        { id: 8, text: t('planner.questions.specialPassengers'), key: "specialPassengers", type: "option", options: ["Yes", "No"] },
        { id: 9, text: t('planner.questions.specialType'), key: "specialType", type: "option", options: ["Child", "Senior"], condition: (data) => data.specialPassengers === "Yes" },
        { id: 10, text: t('planner.questions.flightClass'), key: "flightClass", type: "option", options: ["Economy", "Premium Economy", "Business", "First Class"] },
        { id: 11, text: t('planner.questions.flightTime'), key: "flightTime", type: "option", options: ["Morning", "Afternoon", "Evening", "Night"] },
        { id: 12, text: t('planner.questions.stayInHotel'), key: "stayInHotel", type: "option", options: ["Yes", "No"], condition: (data) => data.tripType === "One-way" },
        { id: 13, text: t('planner.questions.nights'), key: "nights", type: "number", placeholder: "3", condition: (data) => data.tripType === "Round-trip" || data.stayInHotel === "Yes" },
        { id: 14, text: t('planner.questions.roomType'), key: "roomType", type: "option", options: ["Standard", "Deluxe", "Presidential"], condition: (data) => data.tripType === "Round-trip" || data.stayInHotel === "Yes" },
        { id: 15, text: t('planner.questions.hotelRating'), key: "hotelRating", type: "option", options: ["3 Star", "4 Star", "5 Star"], condition: (data) => data.tripType === "Round-trip" || data.stayInHotel === "Yes" },
        { id: 16, text: t('planner.questions.pickup'), key: "pickup", type: "option", options: ["Yes", "No"] },
        { id: 17, text: t('planner.questions.vehicle'), key: "vehicle", type: "option", options: ["Auto", "Bike", "Sedan", "SUV"] },
        { id: 18, text: t('planner.questions.diet'), key: "diet", type: "option", options: ["Veg", "Non-Veg", "Jain", "No preference"] },
        { id: 19, text: t('planner.questions.sightseeing'), key: "sightseeing", type: "option", options: ["Yes", "No"] },
        { id: 20, text: t('planner.questions.optimization'), key: "optimization", type: "option", options: ["Lowest cost", "Comfort", "Luxury"] }
    ];

    const handleAnswer = (key, value) => {
        const updatedAnswers = { ...answers, [key]: value };
        setAnswers(updatedAnswers);

        let nextStep = step + 1;
        while (nextStep < questions.length) {
            const nextQ = questions[nextStep];
            if (!nextQ.condition || nextQ.condition(updatedAnswers)) {
                break;
            }
            nextStep++;
        }

        if (nextStep < questions.length) {
            setStep(nextStep);
        } else {
            calculateTrip(updatedAnswers);
        }
    };

    const calculateTrip = (data) => {
        setLoading(true);
        setTimeout(() => {
            const sourceCity = data.source;
            const destCity = data.destination;
            const sourceData = cityData[sourceCity] || { code: 'SRC', tier: 1.0 };
            const destData = cityData[destCity] || { code: 'DST', tier: 1.0 };
            const avgTier = (sourceData.tier + destData.tier) / 2;
            let costFactor = data.optimization === 'Luxury' ? 2.5 : data.optimization === 'Comfort' ? 1.5 : 0.8;
            const grandTotal = Math.round(8000 * avgTier * costFactor);
            setResult({
                flight: { airline: 'IndiGo', price: Math.round(grandTotal * 0.4), details: `${sourceCity} -> ${destCity}` },
                hotel: { name: `Lemon Tree ${destCity}`, price: Math.round(grandTotal * 0.45), details: `${data.nights} Nights` },
                cab: { type: data.vehicle, price: Math.round(grandTotal * 0.15), details: 'City Travel' },
                total: grandTotal,
                budgetDiff: parseInt(data.budget) - grandTotal
            });
            setLoading(false);
        }, 2000);
    };

    const processPayment = () => {
        // Redirect to main payment page with state
        navigate('/payment', {
            state: {
                bookingType: 'AI Planner',
                tripData: {
                    source: answers.source,
                    destination: answers.destination,
                    departure: answers.departureDate,
                    return: answers.returnDate,
                    passengers: parseInt(answers.travelers),
                    tripType: answers.tripType,
                    class: answers.flightClass,
                    flightNumber: result.flight.airline === 'IndiGo' ? '6E-456' : 'AI-203',
                    airline: result.flight.airline
                },
                prices: {
                    flight: result.flight.price,
                    hotel: result.hotel.price,
                    cab: result.cab.price,
                    total: result.total
                }
            }
        });
    };

    const currentQ = questions[step];

    return (
        <div className={`pt-24 pb-12 px-4 max-w-3xl mx-auto min-h-screen relative bg-light dark:bg-slate-900 transition-colors ${i18n.language === 'ur' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
            <Link to="/" className="absolute top-24 left-4 xl:-left-20 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rtl:xl:left-auto rtl:xl:-right-20 rtl:flex-row-reverse">
                <ArrowRight size={20} className="rotate-180 rtl:rotate-0" /> {t('planner.back')}
            </Link>

            {!result ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-slate-700 relative transition-colors">
                    <div className="mb-8">
                        <div className="h-2 w-full bg-gray-100 dark:bg-slate-700 rounded-full">
                            <motion.div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" animate={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                        </div>
                        <p className="text-right rtl:text-left text-xs text-gray-400 dark:text-gray-500 mt-2">{t('planner.step')} {step + 1} {t('planner.of')} {questions.length}</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                                <h2 className="text-2xl font-bold dark:text-white">{t('planner.optimizing')}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">{t('planner.analyzing', { optimization: answers.optimization, destination: answers.destination })}</p>
                            </motion.div>
                        ) : (
                            <motion.div key={currentQ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">{currentQ.text}</h2>
                                {currentQ.type === 'option' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentQ.options.map(opt => (
                                            <button key={opt} onClick={() => handleAnswer(currentQ.key, opt)} className="p-4 text-left rtl:text-right border-2 border-gray-100 dark:border-slate-700 rounded-xl hover:border-primary dark:hover:border-primary hover:bg-blue-50 dark:hover:bg-slate-700 transition-all font-medium text-lg flex justify-between items-center group text-gray-700 dark:text-gray-200">
                                                {t(`planner.options.${opt}`, opt)}
                                                <ArrowRight className="opacity-0 group-hover:opacity-100 text-primary transition-opacity rtl:rotate-180" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <input
                                                type={currentQ.type}
                                                list={currentQ.list === 'cities' ? 'cities-list' : undefined}
                                                placeholder={t(`planner.placeholders.${currentQ.key}`)}
                                                className="flex-1 p-4 text-xl border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:border-primary focus:outline-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAnswer(currentQ.key, e.target.value);
                                                        e.target.value = ''; // Reset for next step
                                                    }
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousSibling;
                                                    handleAnswer(currentQ.key, input.value);
                                                    input.value = ''; // Reset for next step
                                                }}
                                                className="bg-primary text-white px-8 rounded-xl font-bold hover:bg-secondary transition-colors"
                                            >
                                                {t('planner.next')}
                                            </button>
                                        </div>
                                        {currentQ.list === 'cities' && (
                                            <datalist id="cities-list">
                                                {cities.map(city => <option key={city} value={city} />)}
                                            </datalist>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-slate-700">
                    <div className="text-center mb-10">
                        <div className={`w-20 h-20 ${result.budgetDiff >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {result.budgetDiff >= 0 ? <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" /> : <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{result.budgetDiff >= 0 ? t('planner.perfect_trip') : t('planner.budget_exceeded')}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{result.budgetDiff >= 0 ? t('planner.tailored', { optimization: answers.optimization }) : t('planner.adjust_prefs')}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-blue-50 dark:bg-slate-700/50 rounded-2xl border border-blue-100 dark:border-slate-600">
                            <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-slate-600 p-3 rounded-full text-primary shadow-sm"><Plane /></div>
                                <div><h3 className="font-bold text-lg dark:text-white">{result.flight.airline}</h3><p className="text-gray-500 dark:text-gray-300">{result.flight.details}</p></div>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{result.flight.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                            <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-purple-900/40 p-3 rounded-full text-purple-600 dark:text-purple-300 shadow-sm"><Hotel /></div>
                                <div><h3 className="font-bold text-lg dark:text-white">{result.hotel.name}</h3><p className="text-gray-500 dark:text-gray-300">{result.hotel.details}</p></div>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{result.hotel.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                            <div className="flex items-center gap-4">
                                <div className="bg-white dark:bg-orange-900/40 p-3 rounded-full text-orange-600 dark:text-orange-300 shadow-sm"><Car /></div>
                                <div><h3 className="font-bold text-lg dark:text-white">{result.cab.type}</h3><p className="text-gray-500 dark:text-gray-300">{result.cab.details}</p></div>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{result.cab.price.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-gray-200 dark:border-slate-700 pt-8">
                        <div className="flex justify-between items-center mb-8">
                            <div><p className="text-gray-500 dark:text-gray-400">{t('planner.total_cost')}</p><h3 className="text-4xl font-bold text-primary">₹{result.total.toLocaleString('en-IN')}</h3></div>
                            <div className={`text-right ${result.budgetDiff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                <p className="font-bold">{result.budgetDiff >= 0 ? t('planner.savings') : t('planner.exceess')}</p>
                                <p className="text-xl">₹{Math.abs(result.budgetDiff).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        {result.budgetDiff >= 0 ? (
                            <button onClick={processPayment} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                                <CreditCard /> {t('planner.confirm_pay')}
                            </button>
                        ) : (
                            <button onClick={handleRestart} className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                                <RefreshCcw /> {t('planner.plan_again')}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AIPlanner;
