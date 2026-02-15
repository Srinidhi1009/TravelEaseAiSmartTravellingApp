import React from 'react';
import { Star, MapPin, Wifi, Coffee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const hotelsData = [
    {
        id: 1,
        name: "The Taj Mahal Palace",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80",
        rating: 5.0,
        reviews: 3200,
        price: 25000,
        amenities: ["Sea View", "Spa", "Pool"]
    },
    {
        id: 2,
        name: "Rambagh Palace",
        city: "Jaipur",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 1800,
        price: 45000,
        amenities: ["Heritage", "Garden", "Luxury"]
    },
    {
        id: 3,
        name: "Kumarakom Lake Resort",
        city: "Kerala",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 1500,
        price: 18000,
        amenities: ["Backwaters", "Ayurveda", "Boating"]
    },
    {
        id: 4,
        name: "Wildflower Hall",
        city: "Shimla",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 1200,
        price: 32000,
        amenities: ["Mountain View", "Heated Pool", "Spa"]
    },
    {
        id: 5,
        name: "ITC Grand Chola",
        city: "Chennai",
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80",
        rating: 4.7,
        reviews: 2500,
        price: 15000,
        amenities: ["Luxury", "Dining", "Pool"]
    },
    {
        id: 6,
        name: "Evolve Back",
        city: "Coorg",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 900,
        price: 28000,
        amenities: ["Nature", "Coffee Estate", "Private Pool"]
    },
    {
        id: 7,
        name: "Umaid Bhawan Palace",
        city: "Jodhpur",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80",
        rating: 5.0,
        reviews: 4100,
        price: 65000,
        amenities: ["Royal", "History", "Museum"]
    },
    {
        id: 8,
        name: "The Oberoi Udaivilas",
        city: "Udaipur",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 3500,
        price: 52000,
        amenities: ["Lake View", "Luxury", "Spa"]
    },
    {
        id: 9,
        name: "Taj Lake Palace",
        city: "Udaipur",
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 2100,
        price: 55000,
        amenities: ["Island", "Romantic", "Boat Ride"]
    },
    {
        id: 10,
        name: "The Leela Palace",
        city: "New Delhi",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 2800,
        price: 22000,
        amenities: ["City View", "Rooftop Pool", "Spa"]
    },
    {
        id: 11,
        name: "Mayfair Spa Resort",
        city: "Gangtok",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
        rating: 4.7,
        reviews: 950,
        price: 14000,
        amenities: ["Mountain", "Casino", "Spa"]
    },
    {
        id: 12,
        name: "Ananda in the Himalayas",
        city: "Rishikesh",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80",
        rating: 5.0,
        reviews: 1100,
        price: 42000,
        amenities: ["Wellness", "Yoga", "Nature"]
    },
    {
        id: 13,
        name: "JW Marriott Walnut Grove",
        city: "Mussoorie",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 1400,
        price: 36000,
        amenities: ["Valley View", "Luxury", "Resort"]
    },
    {
        id: 14,
        name: "The Khyber Himalayan Resort",
        city: "Gulmarg",
        image: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 1800,
        price: 35000,
        amenities: ["Skiing", "Snow View", "Spa"]
    },
    {
        id: 15,
        name: "Taj Exotica",
        city: "Goa",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 3100,
        price: 45000,
        amenities: ["Beach", "Luxury", "Villas"]
    }
];

const Hotels = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 dark:text-white">{t('hotels.title') || 'Premium Stays Across India'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotelsData.map((hotel) => (
                    <div
                        key={hotel.id}
                        onClick={() => navigate(`/hotels/${hotel.id}`, { state: { hotel } })}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-slate-700 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm dark:text-white">
                                <Star size={14} className="text-yellow-500 fill-yellow-500" /> {hotel.rating}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{hotel.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-sm mt-1">
                                        <MapPin size={14} /> {hotel.city}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 my-4">
                                {hotel.amenities.map((amenity, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                                        {amenity}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('hotels.price_per_night') || 'Price per night'}</p>
                                    <p className="text-2xl font-bold text-primary dark:text-blue-400">
                                        ₹{hotel.price.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/hotels/${hotel.id}`, { state: { hotel } });
                                    }}
                                    className="bg-dark dark:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-black dark:hover:bg-blue-700 transition-colors"
                                >
                                    {t('hotels.view_details') || 'View Details'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hotels;
