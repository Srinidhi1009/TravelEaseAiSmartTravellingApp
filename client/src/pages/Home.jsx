import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Map, ArrowRight, TrendingUp, CloudSun, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuthContext();

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-dark dark:text-white tracking-tight leading-tight">
                    {t('home.hero_title')} <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>
                        {t('home.hero_highlight')}
                    </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                    {t('home.hero_subtitle')}
                </p>
            </motion.div>

            {/* Dual Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* AI Mode Card */}
                {/* AI Mode Card */}
                <motion.div
                    onClick={() => navigate('/ai-planner')}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer group h-[400px] border border-transparent dark:border-slate-700"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80"
                        alt="AI Planning"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 z-20 p-10 flex flex-col justify-between text-white">
                        <div className="bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-yellow-300" />
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold mb-4">{t('home.ai_planner_title')}</h2>
                            <p className="text-indigo-200 mb-6 text-lg">
                                {t('home.ai_planner_desc')}
                            </p>
                            <span className="flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors w-fit">
                                {t('home.ai_planner_btn')} <ArrowRight size={20} />
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Manual Mode Card */}
                {/* Manual Mode Card */}
                <motion.div
                    onClick={() => navigate('/basic-planner')}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer group h-[400px] border border-transparent dark:border-slate-700"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-red-900 opacity-90 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80"
                        alt="Manual Booking"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 z-20 p-10 flex flex-col justify-between text-white">
                        <div className="bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                            <Map className="w-8 h-8 text-orange-300" />
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold mb-4">{t('home.manual_planner_title')}</h2>
                            <p className="text-orange-200 mb-6 text-lg">
                                {t('home.manual_planner_desc')}
                            </p>
                            <span className="flex items-center gap-2 bg-white text-orange-900 px-6 py-3 rounded-full font-bold hover:bg-orange-100 transition-colors w-fit">
                                {t('home.manual_planner_btn')} <ArrowRight size={20} />
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            {/* Features Section */}
            <motion.div
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-8 relative z-30"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white drop-shadow-md">{t('home.features_title')}</h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full shadow-lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Feature 1: Analytics (Restored) */}
                    <div
                        onClick={() => navigate('/analytics')}
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{t('home.feature_analytics_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                            {t('home.feature_analytics_desc')}
                        </p>
                    </div>

                    {/* Feature 2: Weather */}
                    <div
                        onClick={() => navigate('/dashboard')}
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <CloudSun size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{t('home.feature_weather_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                            {t('home.feature_weather_desc')}
                        </p>
                    </div>

                    {/* Feature 3: Gate Prediction */}
                    <div
                        onClick={() => navigate('/dashboard')}
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">{t('home.feature_gate_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                            {t('home.feature_gate_desc')}
                        </p>
                    </div>

                    {/* Feature 4: Multi-language */}
                    <div
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all group"
                    >
                        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Multi-language Support</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                            Experience TravelEase in 13+ Indian languages including Hindi, Tamil, Telugu, and more.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
