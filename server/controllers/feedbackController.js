const { db } = require('../config/firebase-config');

const submitFeedback = async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;

        if (!userId || !rating) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const feedbackData = {
            userId,
            rating,
            comment: comment || '',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('feedback').add(feedbackData);

        res.status(201).json({
            message: "Feedback submitted successfully",
            id: docRef.id
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Failed to submit feedback" });
    }
};

module.exports = { submitFeedback };
