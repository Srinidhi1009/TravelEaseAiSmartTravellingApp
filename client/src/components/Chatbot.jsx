import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send, MapPin, DoorOpen, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import QuickActions from './QuickActions';
import { useAuthContext } from '../context/AuthContext';

import { CITY_PLACES } from '../data/cityPlaces';

const Chatbot = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuthContext(); // Get real user
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: t('chatbot.responses.welcome', { name: user?.name || t('chatbot.traveler') }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const addMessage = (text, type, widget = null) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            type,
            text,
            ...widget
        }]);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;
        addMessage(input, 'user');
        setInput('');
        processIntent(input);
    };

    const handleQuickAction = (action) => {
        if (!action) return;
        addMessage(action.label, 'user');
        processIntent(action.label, action.id);
    };
    // ...

    // Update greeting when user changes
    useEffect(() => {
        setMessages([
            { id: 1, type: 'bot', text: t('chatbot.responses.welcome', { name: user?.name || t('chatbot.traveler') }) }
        ]);
    }, [user, t]);

    // Switch Trip internal handler
    const handleTripSelect = (tripId) => {
        if (!user) return;
        localStorage.setItem(`travelEase_activeTrip_${user.id}`, tripId);
        window.dispatchEvent(new Event('travelEaseTripSync'));

        const bookingKey = `travelEase_bookings_${user.id}`;
        const storedBookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
        const trip = storedBookings.find(b => b.id === tripId);

        addMessage(t('chatbot.responses.trip_switched', { destination: trip?.destination || 'selected destination' }), 'bot');
    };

    // ... (keep existing functions)

    const processIntent = (text, explicitActionId = null) => {
        setIsTyping(true);
        const lower = (text || "").toLowerCase();

        // Simulate AI thinking delay
        setTimeout(() => {
            setIsTyping(false);
            let responseText = "";
            let widget = null;

            // Fetch real bookings if logged in
            let latestBooking = null;
            if (user) {
                const bookingKey = `travelEase_bookings_${user.id}`;
                const activeTripKey = `travelEase_activeTrip_${user.id}`;
                const storedBookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
                const activeTripId = localStorage.getItem(activeTripKey);

                if (storedBookings.length > 0) {
                    // Favor the active trip selected in Analytics, otherwise latest
                    latestBooking = storedBookings.find(b => b.id === activeTripId) || storedBookings[0];
                }
            }

            // 1. Explicit Action ID or Keyword Matching
            if (explicitActionId === 'weather' || lower.includes('weather')) {
                if (latestBooking) {
                    responseText = t('chatbot.responses.weather_found', { city: latestBooking.destination });
                    widget = {
                        isWidget: true,
                        widgetType: 'weather',
                        data: {
                            city: latestBooking.destination,
                            forecast: [
                                { day: t('weather.days.Mon'), temp: '28°C', icon: '☀️' },
                                { day: t('weather.days.Tue'), temp: '27°C', icon: '⛅' },
                                { day: t('weather.days.Wed'), temp: '29°C', icon: '☀️' },
                            ]
                        }
                    };
                } else {
                    responseText = t('chatbot.responses.weather_no_booking');
                }
            } else if (explicitActionId === 'gate' || lower.includes('gate')) {
                if (latestBooking) {
                    responseText = t('chatbot.responses.gate_lookup', { flight: latestBooking.flightNumber || latestBooking.tripData?.flightNumber || 'AI-203' });
                    widget = {
                        isWidget: true,
                        widgetType: 'gate',
                        data: {
                            flight: latestBooking.flightNumber || latestBooking.tripData?.flightNumber || 'AI-203',
                            airline: latestBooking.airline || latestBooking.tripData?.airline || 'Air India',
                            prediction: `Gate ${latestBooking.gate || '12'} (${t('gate.may_change')})`,
                            status: t('gate.confirmed'),
                            terminal: latestBooking.terminal || 'T3'
                        }
                    };
                } else {
                    responseText = t('chatbot.responses.gate_no_booking');
                }
            } else if (explicitActionId === 'places' || lower.includes('places') || lower.includes('visit') || lower.includes('explore')) {
                const mentionedCity = Object.keys(CITY_PLACES).find(city => lower.includes(city.toLowerCase()));
                const city = mentionedCity || (latestBooking?.destination) || 'Hyderabad';

                responseText = t('chatbot.responses.places_found', { city: city });
                widget = {
                    isWidget: true,
                    widgetType: 'places',
                    data: {
                        city: city,
                        places: CITY_PLACES[city] || CITY_PLACES['Hyderabad']
                    }
                };
            } else if (explicitActionId === 'bookings' || lower.includes('booking')) {
                if (latestBooking) {
                    responseText = t('chatbot.responses.bookings_found');

                    // If round-trip, show separate cards for Departure and Return
                    if (latestBooking.tripData?.tripType === 'Round-trip') {
                        // Special handling for round-trip: Add two messages or one widget with two cards
                        widget = {
                            isWidget: true,
                            widgetType: 'multi_booking',
                            data: [
                                {
                                    id: latestBooking.id,
                                    label: t('chatbot.labels.departure_flight'),
                                    route: `${latestBooking.tripData.source} → ${latestBooking.tripData.destination}`,
                                    date: latestBooking.tripData.travelDate,
                                    passenger: user?.name || t('chatbot.traveler'),
                                    status: t('my_bookings.status_confirmed')
                                },
                                {
                                    id: `${latestBooking.id}-ret`,
                                    label: t('chatbot.labels.return_flight'),
                                    route: `${latestBooking.tripData.destination} → ${latestBooking.tripData.source}`,
                                    date: latestBooking.tripData.returnDate,
                                    passenger: user?.name || t('chatbot.traveler'),
                                    status: t('my_bookings.status_confirmed')
                                }
                            ]
                        };
                    } else {
                        widget = {
                            isWidget: true,
                            widgetType: 'booking_card',
                            data: {
                                id: latestBooking.id,
                                route: `${latestBooking.tripData?.source || 'BOM'} → ${latestBooking.tripData?.destination || 'HYD'}`,
                                date: latestBooking.travelDate || latestBooking.tripData?.travelDate,
                                passenger: user?.name || t('chatbot.traveler'),
                                status: t('my_bookings.status_confirmed')
                            }
                        };
                    }
                } else {
                    responseText = t('my_bookings.no_bookings');
                }
            } else if (explicitActionId === 'flight' || lower.includes('flight')) {
                responseText = t('chatbot.responses.flight_prompt');
            } else if (explicitActionId === 'hotel' || lower.includes('hotel')) {
                responseText = t('chatbot.responses.hotel_prompt');
            } else if (explicitActionId === 'cab' || lower.includes('cab') || lower.includes('taxi')) {
                responseText = t('chatbot.responses.cab_prompt');
            } else if (explicitActionId === 'budget' || lower.includes('budget') || lower.includes('cost')) {
                responseText = t('chatbot.responses.budget_prompt');
            } else if (explicitActionId === 'rebook' || explicitActionId === 'cancel') {
                responseText = t('chatbot.responses.action_not_available');
            } else if (explicitActionId === 'switch_trip') {
                if (user) {
                    const bookingKey = `travelEase_bookings_${user.id}`;
                    const storedBookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
                    if (storedBookings.length > 0) {
                        responseText = t('chatbot.responses.switch_trip_prompt');
                        widget = {
                            isWidget: true,
                            widgetType: 'trip_selector',
                            data: storedBookings.map(b => ({
                                id: b.id,
                                route: `${b.source || b.tripData?.source} → ${b.destination || b.tripData?.destination}`,
                                date: b.date || b.tripData?.travelDate || b.bookingDate
                            }))
                        };
                    } else {
                        responseText = t('my_bookings.no_bookings');
                    }
                } else {
                    responseText = "Please log in to switch trips.";
                }
            } else if (lower.includes('hi') || lower.includes('hello')) {
                responseText = t('chatbot.responses.welcome', { name: user?.name || t('chatbot.traveler') });
            } else {
                responseText = t('chatbot.responses.fallback');
            }
            // ...

            addMessage(responseText, 'bot', widget);
        }, 1200);
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none ${i18n.language === 'ur' ? 'items-start left-6 right-auto' : ''}`}>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="pointer-events-auto w-[350px] h-[600px] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-4"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 dark:bg-slate-950 p-4 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">TravelEase AI</h3>
                                    <p className="text-[10px] text-slate-300 opacity-80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        {t('chatbot.labels.online')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={18} /></button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0B1120] scrollbar-thin">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.type === 'user'
                                        ? 'bg-gradient-to-r from-slate-800 to-slate-900 dark:from-blue-600 dark:to-blue-700 text-white rounded-br-none'
                                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none'
                                        }`}>
                                        {msg.text}

                                        {/* Widgets rendering */}
                                        {/* Weather Widget */}
                                        {msg.isWidget && msg.widgetType === 'weather' && (
                                            <div className="mt-3 bg-blue-50 dark:bg-slate-900/50 rounded-xl p-3 border border-blue-100 dark:border-slate-700">
                                                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-semibold text-xs border-b border-blue-100 dark:border-slate-700 pb-2">
                                                    <MapPin size={12} /> {t('chatbot.labels.forecast', { city: msg.data.city })}
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    {msg.data.forecast.map((d, i) => (
                                                        <div key={i} className="text-center">
                                                            <div className="text-lg">{d.icon}</div>
                                                            <div className="font-bold text-slate-800 dark:text-slate-200">{d.temp}</div>
                                                            <div className="text-[10px] text-slate-500 uppercase">{d.day}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Gate Widget */}
                                        {msg.isWidget && msg.widgetType === 'gate' && (
                                            <div className="mt-3 bg-purple-50 dark:bg-slate-900/50 rounded-xl p-3 border border-purple-100 dark:border-slate-700">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-slate-500">{msg.data.airline} • {msg.data.flight}</span>
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{msg.data.status}</span>
                                                </div>
                                                <div className="text-lg font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2">
                                                    <DoorOpen size={20} />
                                                    {msg.data.prediction}
                                                </div>
                                                {msg.data.terminal && (
                                                    <div className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                        <MapPin size={10} /> {t('chatbot.labels.terminal')}: {msg.data.terminal}
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-slate-400 mt-1">{t('chatbot.labels.historical_data')}</div>
                                            </div>
                                        )}

                                        {/* Places Widget */}
                                        {msg.isWidget && msg.widgetType === 'places' && (
                                            <div className="mt-3 space-y-2">
                                                {msg.data.places.map((place, idx) => (
                                                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">📍 {place}</span>
                                                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                                            <span className="text-[10px]">➜</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Booking Card Widget */}
                                        {msg.isWidget && (msg.widgetType === 'booking_card' || msg.widgetType === 'multi_booking') && (
                                            <div className="mt-3 space-y-3">
                                                {(msg.widgetType === 'multi_booking' ? msg.data : [msg.data]).map((booking, bIdx) => (
                                                    <div key={bIdx} className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                {booking.label && <div className="text-[10px] text-primary font-black uppercase mb-1">{booking.label}</div>}
                                                                <div className="text-[10px] text-slate-400 font-medium">{t('chatbot.labels.flight_booking')}</div>
                                                                <div className="font-bold text-slate-800 dark:text-white mt-0.5">{booking.route}</div>
                                                                <div className="text-[10px] text-slate-500 mt-1 font-bold">{booking.passenger}</div>
                                                            </div>
                                                            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">{booking.status}</span>
                                                        </div>
                                                        <div className="mt-2 flex justify-between items-center text-[10px] text-slate-500">
                                                            <span>{booking.date}</span>
                                                            <span>{t('chatbot.labels.ref')}: {booking.id.toString().slice(-6)}</span>
                                                        </div>
                                                        <button className="w-full mt-3 bg-slate-900 dark:bg-slate-700 text-white text-[10px] py-1.5 rounded hover:bg-slate-800 transition-colors uppercase font-bold tracking-wider">{t('chatbot.labels.view_ticket')}</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Trip Selector Widget */}
                                        {msg.isWidget && msg.widgetType === 'trip_selector' && (
                                            <div className="mt-3 space-y-2">
                                                {msg.data.map((trip) => (
                                                    <button
                                                        key={trip.id}
                                                        onClick={() => handleTripSelect(trip.id)}
                                                        className="w-full text-left bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all group"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <div className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{trip.route}</div>
                                                                <div className="text-[10px] text-slate-500">{trip.date}</div>
                                                            </div>
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-[10px]">➜</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions & Input */}
                        <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">

                            <QuickActions onAction={handleQuickAction} />

                            <div className="p-3 flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={t('chatbot.placeholder')}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="bg-slate-900 dark:bg-blue-600 text-white p-2.5 rounded-full hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                                >
                                    <Send size={16} className={i18n.language === 'ur' ? 'scale-x-[-1]' : ''} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-slate-900 dark:bg-slate-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-900/20 z-50 transition-colors relative"
            >
                {isOpen ? <X size={24} /> : (
                    <>
                        <Bot size={28} strokeWidth={1.5} />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;

