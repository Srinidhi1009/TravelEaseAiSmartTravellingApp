import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FareBreakdown = ({ breakdown }) => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${i18n.language === 'ur' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline"
            >
                <Info size={12} /> {t('fare_details.view_breakdown')}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full mb-2 -left-20 rtl:-left-auto rtl:-right-20 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 p-4 z-50 transition-colors"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500">{t('fare_details.title')}</h4>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full dark:text-white">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="space-y-3 text-sm">
                                {breakdown.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">{item.label}</span>
                                        <span className="font-bold">₹{item.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                                <div className="border-t border-dashed border-gray-200 dark:border-slate-600 pt-3 mt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                                    <span>{t('fare_details.total_base')}</span>
                                    <span className="text-primary text-xl">₹{breakdown.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FareBreakdown;
