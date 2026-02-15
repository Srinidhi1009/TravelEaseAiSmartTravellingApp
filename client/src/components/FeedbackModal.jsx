import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const FeedbackModal = ({ isOpen, onClose, userId, onLogout }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'feedback'), {
                userId: userId || 'anonymous',
                rating,
                comment,
                createdAt: new Date().toISOString()
            });
            onLogout(); // Proceed to logout after feedback
        } catch (error) {
            console.error("Error submitting feedback:", error);
            onLogout(); // Logout even if feedback fails
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };

    const handleSkip = () => {
        onLogout();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Rate Your Experience
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        How was your session with TravelEase?
                    </p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star
                                size={32}
                                className={`
                                    ${(hoveredRating || rating) >= star
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'}
                                    transition-colors duration-200
                                `}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or how we can improve... (Optional)"
                    className="w-full h-24 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none mb-6 transition-all"
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleSkip}
                        className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary/20
                            ${rating > 0
                                ? 'bg-primary hover:bg-secondary transform hover:-translate-y-0.5'
                                : 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed'}
                        `}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
