import React from 'react';
import { Plane, Hotel, Car, CloudSun, DoorOpen, RotateCcw, XCircle, FileText, Wallet, MapPin } from 'lucide-react';

const actions = [

    { id: 'weather', label: 'Weather', icon: CloudSun, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
    { id: 'gate', label: 'Gate Info', icon: DoorOpen, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    { id: 'switch_trip', label: 'Switch Trip', icon: RotateCcw, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
    { id: 'rebook', label: 'Rebook', icon: RotateCcw, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
    { id: 'cancel', label: 'Cancel', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    { id: 'bookings', label: 'My Bookings', icon: FileText, color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
    { id: 'budget', label: 'Budget', icon: Wallet, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    { id: 'places', label: 'Local Places', icon: MapPin, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
];

const QuickActions = ({ onAction }) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-1 scrollbar-hide snap-x">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onAction(action)}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-transform hover:scale-105 active:scale-95 snap-start
                        border border-transparent hover:border-current
                        ${action.color}
                    `}
                >
                    <action.icon size={14} />
                    {action.label}
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
