import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Calendar, AlertCircle, X, Droplets, Eye, Gauge, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const weatherData = {
    'Delhi': { temp: 28, condition: 'Sunny', hum: 45, wind: 12, uv: 6, vis: 10, pressure: 1012 },
    'Mumbai': { temp: 31, condition: 'Cloudy', hum: 75, wind: 18, uv: 4, vis: 8, pressure: 1008 },
    'Bangalore': { temp: 24, condition: 'Sunny', hum: 50, wind: 10, uv: 8, vis: 12, pressure: 1015 },
    'Chennai': { temp: 33, condition: 'Sunny', hum: 80, wind: 15, uv: 7, vis: 9, pressure: 1010 },
    'Kolkata': { temp: 30, condition: 'Rain', hum: 85, wind: 20, uv: 3, vis: 6, pressure: 1005 },
    'Jaipur': { temp: 32, condition: 'Sunny', hum: 30, wind: 8, uv: 9, vis: 10, pressure: 1011 },
    'Kochi': { temp: 29, condition: 'Rain', hum: 90, wind: 14, uv: 5, vis: 7, pressure: 1009 }
};

const WeatherDashboard = ({ tripData }) => {
    const { t, i18n } = useTranslation();
    const today = new Date().getDay();
    const i18nDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [alert, setAlert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!tripData?.destination) return;

        const city = Object.keys(weatherData).find(c => tripData.destination.includes(c)) || 'Delhi';
        const current = weatherData[city] || weatherData['Delhi'];
        setCurrentWeather(current);

        // Mock 7-day forecast
        const generatedForecast = Array.from({ length: 7 }, (_, i) => ({
            day: i18nDays[(today + i) % 7],
            dayKey: i18nDays[(today + i) % 7], // Used for lookup
            temp: current.temp + Math.floor(Math.random() * 6) - 3,
            low: current.temp - 8 + Math.floor(Math.random() * 4),
            condition: i % 3 === 0 ? 'Cloudy' : (i % 4 === 0 ? 'Rain' : 'Sunny')
        }));
        setForecast(generatedForecast);

        // Mock 24-hour forecast
        const generatedHourly = Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            temp: current.temp - Math.floor(Math.abs(12 - i) / 2),
            condition: i > 6 && i < 18 ? (current.condition === 'Rain' ? 'Rain' : 'Sunny') : 'Cloudy'
        }));
        setHourlyForecast(generatedHourly);

        // Mock alerts
        if (current.temp > 32) {
            setAlert({ type: 'severe', title: t('weather.heatwave'), msg: 'Stay hydrated! High temps at destination.' });
        } else if (current.condition === 'Rain') {
            setAlert({ type: 'warning', title: t('weather.rain'), msg: 'Carry an umbrella. Light showers expected.' });
        }
    }, [tripData, t]);

    if (!currentWeather) return null;

    const renderIcon = (condition, size = 24) => {
        switch (condition) {
            case 'Sunny': return <Sun size={size} className="text-yellow-500" />;
            case 'Cloudy': return <Cloud size={size} className="text-gray-400" />;
            case 'Rain': return <CloudRain size={size} className="text-blue-500" />;
            default: return <Sun size={size} />;
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 h-full cursor-pointer group transition-all"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                            {t('weather.dest_weather')} <Eye size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">{currentWeather.temp}°C</span>
                            {renderIcon(currentWeather.condition, 32)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-800 dark:text-white font-bold">{tripData.destination}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(tripData.date).toLocaleDateString(i18n.language, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {alert && (
                    <div className={`mb-6 p-3 rounded-xl flex items-center gap-3 ${alert.type === 'severe' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'}`}>
                        <AlertCircle size={20} />
                        <div className="text-xs">
                            <div className="font-bold">{alert.title}</div>
                            <div>{alert.msg}</div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-5 gap-2 mb-6">
                    {forecast.slice(0, 5).map((day, i) => (
                        <div key={i} className="text-center p-2 rounded-xl bg-gray-50/50 dark:bg-slate-700/50">
                            <div className="text-[10px] text-gray-400 dark:text-gray-400 mb-1">{t(`weather.days.${day.dayKey}`)}</div>
                            <div className="flex justify-center mb-1">{renderIcon(day.condition, 16)}</div>
                            <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{day.temp}°</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Wind size={14} /> <span>{currentWeather.wind} km/h</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Thermometer size={14} /> <span>{currentWeather.hum}%</span>
                    </div>
                </div>
            </motion.div>

            {/* Detailed Weather Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col border border-gray-100 dark:border-slate-700"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <Navigation size={24} className="text-primary" />
                                        {tripData.destination} {t('weather.weather_suffix')}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t('weather.detailed_metrics')}</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                {/* Current Status */}
                                <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-3xl border border-blue-100 dark:border-slate-700">
                                    <div className="flex items-center gap-6">
                                        {renderIcon(currentWeather.condition, 64)}
                                        <div>
                                            <div className="text-5xl font-black text-gray-800 dark:text-white">{currentWeather.temp}°</div>
                                            <div className="text-lg text-gray-600 dark:text-gray-300 font-medium">{t(`weather.conditions.${currentWeather.condition}`)}</div>
                                            <p className="text-sm text-gray-400 mt-1">{t('weather.feels_like')} {currentWeather.temp + 2}°</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"><Wind size={20} className="text-gray-500 dark:text-gray-400" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">{t('weather.wind')}</p>
                                                <p className="font-bold text-gray-700 dark:text-white">{currentWeather.wind} km/h</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"><Droplets size={20} className="text-gray-500 dark:text-gray-400" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">{t('weather.humidity')}</p>
                                                <p className="font-bold text-gray-700 dark:text-white">{currentWeather.hum}%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"><Sun size={20} className="text-gray-500 dark:text-gray-400" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">{t('weather.uv_index')}</p>
                                                <p className="font-bold text-gray-700 dark:text-white">{currentWeather.uv} ({t('weather.severe')})</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"><Gauge size={20} className="text-gray-500 dark:text-gray-400" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">{t('weather.pressure')}</p>
                                                <p className="font-bold text-gray-700 dark:text-white">{currentWeather.pressure} hPa</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hourly Forecast - Horizontal Scroll */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Hourly Forecast</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                        {hourlyForecast.map((hour, i) => (
                                            <div key={i} className="min-w-[80px] p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                                                <span className="text-xs text-gray-400 font-medium">{hour.time}</span>
                                                {renderIcon(hour.condition, 20)}
                                                <span className="text-lg font-bold text-gray-800 dark:text-white">{hour.temp}°</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 7-Day Forecast - Vertical */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('weather.7day_forecast')}</h3>
                                    <div className="space-y-3">
                                        {forecast.map((day, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                                <div className="w-24 font-bold text-gray-700 dark:text-gray-200">{t(`weather.days.${day.dayKey}`)}</div>
                                                <div className="flex items-center gap-3 flex-1 justify-center">
                                                    {renderIcon(day.condition, 20)}
                                                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t(`weather.conditions.${day.condition}`)}</span>
                                                </div>
                                                <div className="flex items-center gap-4 w-32 justify-end">
                                                    <span className="font-bold text-gray-800 dark:text-white">{day.temp}°</span>
                                                    <div className="h-1 w-16 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden relative">
                                                        <div
                                                            className="absolute inset-y-0 left-0 bg-primary rounded-full"
                                                            style={{ width: `${((day.temp - (day.low || 20)) / 15) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-gray-400 text-sm">{day.low}°</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default WeatherDashboard;
