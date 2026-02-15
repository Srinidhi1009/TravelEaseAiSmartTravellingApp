exports.processPayment = (req, res) => {
    try {
        const { bookingId, amount, method, details } = req.body;

        // Mock Validation
        if (method === 'UPI') {
            if (!details.upiId.includes('@')) {
                return res.status(400).json({ message: 'Invalid UPI ID', status: 'Failed' });
            }
        } else if (method === 'Card') {
            if (details.cardNumber.length < 12) {
                return res.status(400).json({ message: 'Invalid Card Number', status: 'Failed' });
            }
        }

        // Mock Success
        res.json({
            message: 'Payment processed successfully',
            transactionId: 'TXN' + Date.now(),
            amount,
            status: 'Success',
            method
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
