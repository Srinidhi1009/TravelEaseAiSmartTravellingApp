import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Download } from 'lucide-react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BookingSuccess = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { transactionId, amount } = location.state || {};

    if (!transactionId) {
        return <Navigate to="/" />;
    }

    return (
        <div className={`pt-24 pb-12 px-4 max-w-3xl mx-auto min-h-screen flex flex-col items-center justify-center text-center bg-light dark:bg-slate-900 transition-colors ${i18n.language === 'ur' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-8 shadow-lg"
            >
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('success.title')}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    {t('success.message')}
                </p>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 w-full max-w-md mx-auto mb-10 transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex justify-between mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{t('success.transaction_id')}</span>
                        <span className="font-mono font-bold text-gray-800 dark:text-white">{transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{t('success.amount_paid')}</span>
                        <span className="font-bold text-3xl text-green-600 dark:text-green-400">₹{amount?.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
                        <Home size={20} /> {t('success.go_home')}
                    </Link>
                    <button className="bg-white dark:bg-slate-800 text-gray-700 dark:text-white border-2 border-gray-200 dark:border-slate-600 px-8 py-4 rounded-xl font-bold hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <Download size={20} /> {t('success.download_invoice')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
