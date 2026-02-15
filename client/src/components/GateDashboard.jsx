import React, { useState, useEffect } from 'react';
import { Plane, AlertTriangle, ArrowRight, Clock, MapPin, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const GateDashboard = ({ tripData }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [gateStatus, setGateStatus] = useState({
        gate: 'TBD',
        terminal: 'TBD',
        status: t('gate.scheduled'),
        color: 'gray',
        prediction: null
    });

    useEffect(() => {
        if (!tripData) return;

        // Mock Logic for Gate assignment based on time/airline
        const airline = tripData.breakdown?.flight?.airline || 'IndiGo';
        const isIndigo = airline.includes('IndiGo');

        // Randomly simulate gate status based on current time seconds (for demo)
        const random = Math.random();

        let status = {
            gate: isIndigo ? 'A12' : 'B45',
            terminal: isIndigo ? 'T3' : 'T2',
            status: t('gate.confirmed'),
            color: 'green',
            prediction: 'Gate likely to remain same'
        };

        if (random > 0.7) {
            status.status = t('gate.may_change');
            status.color = 'yellow';
            status.prediction = 'High traffic at T3. 60% chance of shift to Gate A15.';
        } else if (random > 0.9) {
            status.status = t('gate.gate_changed');
            status.color = 'red';
            status.gate = 'C03';
            status.prediction = 'Gate reassigned due to incoming delay.';
        }

        setGateStatus(status);

    }, [tripData, t]);

    if (!tripData) return null;

    return (
        <React.Fragment>
            {/* Gate Card */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsOpen(true)}
                className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border-l-4 border-${gateStatus.color}-500 cursor-pointer relative overflow-hidden group`}
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Terminal size={80} className="dark:text-white" />
                </div>

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider mb-1">{t('gate.smart_status')}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full bg-${gateStatus.color}-500 animate-pulse`}></span>
                            <span className={`text-${gateStatus.color}-600 dark:text-${gateStatus.color}-400 font-bold text-sm`}>{gateStatus.status}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">{gateStatus.gate}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t('gate.terminal')} {gateStatus.terminal}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Plane size={14} /> {tripData.breakdown?.flight?.airline || 'Flight'}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <Clock size={12} /> {t('gate.last_updated')}: {t('gate.just_now')}
                    </div>
                </div>
            </motion.div>

            {/* Detailed Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-gray-100 dark:border-slate-700"
                        >
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>

                            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-slate-700 pb-6">
                                <div className={`w-16 h-16 rounded-full bg-${gateStatus.color}-100 dark:bg-${gateStatus.color}-900/30 flex items-center justify-center text-${gateStatus.color}-600 dark:text-${gateStatus.color}-400`}>
                                    <Terminal size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('gate.boarding_gate')} {gateStatus.gate}</h2>
                                    <p className="text-gray-500 dark:text-gray-400">{t('gate.terminal')} {gateStatus.terminal} • {tripData.source} Airport</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                                        <Clock size={16} className="text-blue-500" /> {t('gate.real_time_status')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Your gate is currently <strong>{gateStatus.status}</strong>. {gateStatus.prediction}
                                    </p>
                                </div>

                                <div className="relative pl-6 border-l-2 border-gray-200 dark:border-slate-700 space-y-8">
                                    <div className="relative">
                                        <div className="absolute -left-[31px] bg-green-500 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"></div>
                                        <p className="text-xs text-gray-400 mb-1">{t('gate.checkin_open')}</p>
                                        <p className="font-bold text-gray-800 dark:text-white">{t('gate.counters')} 14-20</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[31px] bg-${gateStatus.color === 'green' ? 'blue' : 'gray'}-400 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm`}></div>
                                        <p className="text-xs text-gray-400 mb-1">{t('gate.security_check')}</p>
                                        <p className="font-bold text-gray-800 dark:text-white">{t('gate.zone')} B ({t('gate.less_crowded')})</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[31px] bg-${gateStatus.color}-500 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm animate-pulse`}></div>
                                        <p className="text-xs text-gray-400 mb-1">{t('gate.boarding_gate')}</p>
                                        <p className="font-bold text-gray-800 dark:text-white">{gateStatus.gate} <span className={`text-${gateStatus.color}-600 dark:text-${gateStatus.color}-400 text-xs ml-2`}>({gateStatus.status})</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center text-sm text-gray-400">
                                <span>Flight: {tripData.breakdown?.flight?.airline}</span>
                                <span className="flex items-center gap-1"><MapPin size={12} /> {t('gate.live_tracking')}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </React.Fragment>
    );
};

export default GateDashboard;
