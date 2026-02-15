import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { createBooking } from '../services/api';
import { useAuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Payment = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { tripData, prices } = location.state || {}; // Expecting simplified data for now

    // Redirect if no data
    if (!tripData || !prices) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600 mb-4">{t('payment.no_details')}</p>
                <button onClick={() => navigate('/basic-planner')} className="text-blue-600 font-bold hover:underline">
                    {t('payment.return_to_planner')}
                </button>
            </div>
        );
    }

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [processing, setProcessing] = useState(false);

    const verifyUpi = (id) => /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(id);

    const handlePayment = () => {
        setProcessing(true);
        // Simulate payment delay
        setTimeout(() => {
            setProcessing(false);

            // Unlock Analytics & Store History
            // Normalize payload to avoid undefined values which break Firestore
            const travelDate = tripData.date || tripData.departure || new Date().toISOString().split('T')[0];

            const bookingPayload = {
                id: `BK-${Date.now().toString().slice(-6)}`,
                userId: user?.id || 'guest',
                source: tripData.source || '',
                destination: tripData.destination || '',
                date: travelDate,
                type: location.state?.bookingType || 'Manual',
                tripData: {
                    ...tripData,
                    travelDate: travelDate
                },
                totalPrice: Number(prices?.total) || 0,
                breakdown: prices || {},
                bookingDate: new Date().toISOString(),
                status: 'Confirmed'
            };

            createBooking(bookingPayload).then(() => {
                // Sync with local storage for instant analytics/dashboard access
                const bookingKey = `travelEase_bookings_${user?.id || 'guest'}`;
                const existingBookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
                localStorage.setItem(bookingKey, JSON.stringify([bookingPayload, ...existingBookings]));

                localStorage.setItem('hasBooked', 'true');
                localStorage.setItem('lastPrice', prices.total);

                // Navigate to success
                navigate('/booking-success', {
                    state: {
                        transactionId: `PAY-${Date.now().toString().slice(-6)}`,
                        amount: prices.total
                    }
                });
            }).catch(err => {
                console.error("Booking Error", err);
                alert("Booking failed. Please try again.");
                setProcessing(false);
            });
        }, 2000);
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto min-h-screen bg-light dark:bg-slate-900 transition-colors">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors font-bold">
                <ArrowLeft size={20} /> {t('payment.back_to_edit')}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-slate-700 transition-colors">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white">
                            <Lock className="text-green-600 dark:text-green-400" /> {t('payment.secure_payment')}
                        </h2>

                        {/* Payment Methods */}
                        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                            {['card', 'upi', 'netbanking'].map(method => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`px-6 py-3 rounded-xl font-bold border-2 transition-all whitespace-nowrap ${paymentMethod === method ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400' : 'border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:border-blue-200 dark:hover:border-slate-500'}`}
                                >
                                    {method === 'card' ? 'Credit/Debit Card' : method.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Card Form */}
                        {paymentMethod === 'card' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono dark:text-white"
                                            maxLength={19}
                                            value={cardDetails.number}
                                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                            maxLength={5}
                                            value={cardDetails.expiry}
                                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                                        <input
                                            type="password"
                                            placeholder="123"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                            maxLength={3}
                                            value={cardDetails.cvv}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Holder Name</label>
                                    <input
                                        type="text"
                                        placeholder="Name on Card"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        value={cardDetails.name}
                                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* UPI Form */}
                        {paymentMethod === 'upi' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Enter UPI ID</label>
                                    <input
                                        type="text"
                                        placeholder="username@bank"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Ex: mobile-number@upi, yourname@sbi, etc.
                                    </p>
                                </div>
                                {upiId && !verifyUpi(upiId) && (
                                    <div className="text-red-500 text-sm flex items-center gap-1">
                                        <AlertCircle size={14} /> Invalid UPI ID format
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Net Banking Form */}
                        {paymentMethod === 'netbanking' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Select Bank</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { name: 'HDFC', logo: 'https://logo.clearbit.com/hdfcbank.com' },
                                        { name: 'SBI', logo: 'https://logo.clearbit.com/sbi.co.in' },
                                        { name: 'ICICI', logo: 'https://logo.clearbit.com/icicibank.com' },
                                        { name: 'Axis', logo: 'https://logo.clearbit.com/axisbank.com' },
                                        { name: 'Kotak', logo: 'https://logo.clearbit.com/kotak.com' },
                                        { name: 'PNB', logo: 'https://logo.clearbit.com/pnbindia.in' }
                                    ].map(bank => (
                                        <button
                                            key={bank.name}
                                            onClick={() => setSelectedBank(bank.name)}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedBank === bank.name ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-900/20 dark:border-blue-400 dark:ring-blue-900' : 'border-gray-100 dark:border-slate-600 hover:border-blue-200 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                                        >
                                            <img src={bank.logo} alt={bank.name} className="w-8 h-8 object-contain rounded-full" onError={(e) => { e.target.src = 'https://via.placeholder.com/32?text=Bank'; }} />
                                            <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{bank.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary for Mobile */}
                        <div className="lg:hidden mt-8 border-t border-gray-200 dark:border-slate-700 pt-6">
                            <div className="flex justify-between items-center text-xl font-bold dark:text-white">
                                <span>Total Amount</span>
                                <span>₹{prices.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full mt-8 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? 'Processing...' : `Pay ₹${prices.total.toLocaleString('en-IN')}`}
                        </button>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-slate-700 sticky top-28 transition-colors">
                        <h3 className="text-xl font-bold mb-6 dark:text-white">Booking Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Flight</div>
                                <div className="font-bold dark:text-white">{tripData.source} <span className="text-gray-400">→</span> {tripData.destination}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tripData.class} • {tripData.passengers} Pax</div>
                            </div>

                            {prices.hotel > 0 && (
                                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hotel</div>
                                    <div className="font-bold dark:text-white">Grand {tripData.destination} Palace</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tripData.roomType} Room</div>
                                </div>
                            )}

                            {prices.cab > 0 && (
                                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cab</div>
                                    <div className="font-bold dark:text-white">Airport Transfer</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tripData.vehicle}</div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-dashed border-gray-200 dark:border-slate-600 pt-4">
                            <div className="flex justify-between items-center mb-2 text-gray-500 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{(prices.total - prices.total * 0.18 / 1.18).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 text-gray-500 dark:text-gray-400">
                                <span>Taxes (18%)</span>
                                <span>₹{(prices.total * 0.18 / 1.18).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-2xl font-bold text-gray-800 dark:text-white">
                                <span>Grand Total</span>
                                <span>₹{prices.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
