import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SeatMap = ({ isOpen, onClose, onConfirm, travelers = 1 }) => {
    const { t, i18n } = useTranslation();
    const [selectedSeats, setSelectedSeats] = useState([]);

    const rows = 15;
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const occupied = ['1A', '1B', '2C', '3D', '4E', '5F', '9A', '10C', '12D'];
    const premiumRows = [1, 2, 3, 4];

    const handleSeatClick = (seatId) => {
        if (occupied.includes(seatId)) return;
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
        } else if (selectedSeats.length < travelers) {
            setSelectedSeats(prev => [...prev, seatId]);
        } else if (travelers === 1) {
            setSelectedSeats([seatId]);
        }
    };

    const getSeatStatus = (seatId, rowIndex) => {
        if (occupied.includes(seatId)) return 'occupied';
        if (selectedSeats.includes(seatId)) return 'selected';
        if (premiumRows.includes(rowIndex + 1)) return 'premium';
        return 'available';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${i18n.language === 'ur' ? 'rtl' : 'ltr'}`} dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] transition-colors">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center">
                            <div><h3 className="font-bold text-lg dark:text-white">{t('seat_map.title')}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{selectedSeats.length}/{travelers} {t('seat_map.selected')}</p></div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full dark:text-white"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-800">
                            <div className="w-16 h-8 mx-auto bg-gray-100 dark:bg-slate-600 rounded-t-full mb-2 border-t-4 border-gray-200 dark:border-slate-500" />
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center uppercase tracking-tighter mb-6">{t('seat_map.nose_indicator')}</div>
                            <div className="grid gap-4">
                                {Array.from({ length: rows }).map((_, rIndex) => (
                                    <div key={rIndex} className="flex justify-center items-center gap-6">
                                        <div className="flex gap-2">
                                            {cols.slice(0, 3).map(col => {
                                                const id = `${rIndex + 1}${col}`;
                                                const s = getSeatStatus(id, rIndex);
                                                return (
                                                    <button key={id} onClick={() => handleSeatClick(id)} disabled={s === 'occupied'} className={`w-9 h-9 rounded-lg border-2 text-xs font-bold transition-all ${s === 'occupied' ? 'bg-gray-800 border-gray-800 opacity-30 dark:bg-slate-900 dark:border-slate-900' : s === 'selected' ? 'bg-green-500 border-green-500 text-white' : s === 'premium' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50 dark:text-white' : 'bg-gray-50 border-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-white'}`}>
                                                        {id}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="w-6 text-center text-[10px] text-gray-300 dark:text-gray-600 font-mono">{rIndex + 1}</div>
                                        <div className="flex gap-2">
                                            {cols.slice(3, 6).map(col => {
                                                const id = `${rIndex + 1}${col}`;
                                                const s = getSeatStatus(id, rIndex);
                                                return (
                                                    <button key={id} onClick={() => handleSeatClick(id)} disabled={s === 'occupied'} className={`w-9 h-9 rounded-lg border-2 text-xs font-bold transition-all ${s === 'occupied' ? 'bg-gray-800 border-gray-800 opacity-30 dark:bg-slate-900 dark:border-slate-900' : s === 'selected' ? 'bg-green-500 border-green-500 text-white' : s === 'premium' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50 dark:text-white' : 'bg-gray-50 border-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-white'}`}>
                                                        {id}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 dark:bg-slate-700 border dark:border-slate-600 rounded" /> {t('seat_map.legend_available')}</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded" /> {t('seat_map.legend_selected')}</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-800 opacity-30 dark:bg-slate-900 rounded" /> {t('seat_map.legend_occupied')}</div>
                                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50 rounded" /> {t('seat_map.legend_premium')}</div>
                            </div>
                            <button onClick={() => onConfirm(selectedSeats)} disabled={selectedSeats.length === 0} className="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg">
                                {t('seat_map.confirm_selection', { seats: selectedSeats.join(', ') })}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SeatMap;
