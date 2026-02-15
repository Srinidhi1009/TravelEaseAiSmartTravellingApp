import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Award, Users, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    // Use passed data or fallback
    const passedHotel = location.state?.hotel;

    const hotel = {
        id: id,
        name: passedHotel?.name || "Grand Royal Palace",
        city: passedHotel?.city || "Mumbai",
        image: passedHotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
        rating: passedHotel?.rating || 4.9,
        reviews: passedHotel?.reviews || 1240,
        price: passedHotel?.price || 15000,
        description: passedHotel?.description || "Experience world-class service. Nestled in the heart of the city, this hotel offers a perfect blend of luxury and comfort. featuring an outdoor swimming pool, a spa and wellness centre, and 5 dining options.",
        amenities: passedHotel?.amenities || ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Airport Shuttle", "Family Rooms", "Bar"],
        comments: [
            { user: "Amit Sharma", rating: 5, text: "Absolutely stunning property! The staff was incredibly welcoming." },
            { user: "Sarah Jenkins", rating: 4, text: "Great location and beautiful rooms. Breakfast could be better." },
            { user: "Rahul Verma", rating: 5, text: "Best stay ever. The view from the suite was breathtaking." }
        ]
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white mb-4 group flex items-center gap-1 transition-colors">
                    &larr; {t('hotels.back_to_hotels') || 'Back to Hotels'}
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-dark dark:text-white mb-2">{hotel.name}</h1>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <MapPin size={18} /> {hotel.city} • {t('hotels.luxury_tag') || '5-Star Luxury Hotel'}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                            <Star size={16} fill="currentColor" /> {hotel.rating}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">({hotel.reviews} {t('hotels.reviews') || 'Reviews'})</span>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="md:col-span-2 h-64 md:h-96 relative rounded-2xl overflow-hidden shadow-sm">
                    <img src={hotel.image} alt="Main" className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:h-96">
                    <div className="h-32 md:h-full relative rounded-2xl overflow-hidden shadow-sm">
                        <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80" alt="Room" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-32 md:h-full relative rounded-2xl overflow-hidden shadow-sm">
                        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80" alt="Dining" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Details Column */}
                <div className="lg:col-span-2 space-y-12">

                    {/* About */}
                    <section className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-slate-700/30">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('hotels.about') || 'About this stay'}</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            {hotel.description}
                        </p>
                    </section>

                    {/* Amenities */}
                    <section className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-slate-700/30">
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('hotels.popular_amenities') || 'Popular Amenities'}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {hotel.amenities.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reviews */}
                    <section className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-slate-700/30">
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">{t('hotels.guest_reviews') || 'Guest Reviews'}</h2>
                        <div className="space-y-6">
                            {hotel.comments.map((comment, idx) => (
                                <div key={idx} className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-2xl border border-gray-100/50 dark:border-slate-700 shadow-sm transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                                                {comment.user[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold dark:text-white">{comment.user}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{t('hotels.verified_guest') || 'Verified Guest'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">
                                            {comment.rating} <Star size={10} fill="currentColor" />
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 italic">"{comment.text}"</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Booking Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-3xl font-bold dark:text-white">₹{hotel.price.toLocaleString('en-IN')}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm"> / {t('hotels.night') || 'night'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                                <ShieldCheck size={14} /> {t('hotels.best_price') || 'Best Price'}
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                                <span className="text-gray-500 dark:text-gray-300 text-sm">{t('hotels.check_in') || 'Check-in'}</span>
                                <span className="font-bold dark:text-white">{t('hotels.select_date') || 'Select Date'}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                                <span className="text-gray-500 dark:text-gray-300 text-sm">{t('hotels.guests') || 'Guests'}</span>
                                <span className="font-bold dark:text-white">{t('hotels.adults_room') || '2 Adults, 1 Room'}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                // Direct booking flow for Hotel
                                navigate('/payment', {
                                    state: {
                                        tripData: {
                                            source: 'My Location', // Mock or derived
                                            destination: hotel.city,
                                            date: new Date().toISOString().split('T')[0],
                                            passengers: 2
                                        },
                                        prices: {
                                            total: hotel.price,
                                            flight: 0,
                                            hotel: hotel.price,
                                            cab: 0
                                        }
                                    }
                                });
                            }}
                            className="w-full bg-black dark:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            {t('hotels.book_now') || 'Book Now'} <ArrowRight size={20} />
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">{t('hotels.no_payment') || 'No payment charged yet'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
