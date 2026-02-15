// Mock Gate Data
const gates = ['1A', '2B', '3C', '4D', '5E', '12A', 'T3-15'];

exports.getGateStatus = (req, res) => {
    try {
        const { flightId } = req.query;

        // Random Simulation Logic
        const statuses = ['Green', 'Mango Yellow', 'Red'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        let gateData = {
            flightId: flightId || 'F101',
            airline: 'IndiGo',
            airportCode: 'HYD',
            terminal: '1',
            assignedGate: '12A',
            predictedGate: '12A',
            gateStatus: 'same', // same, may-change, changed
            alert: false,
            colorCode: 'Green'
        };

        if (randomStatus === 'Mango Yellow') {
            gateData.gateStatus = 'may-change';
            gateData.predictedGate = '14B'; // Different predicted
            gateData.colorCode = 'Mango Yellow';
            gateData.alert = true;
            gateData.message = 'Gate assignment is unstable. Check monitors.';
        } else if (randomStatus === 'Red') {
            gateData.gateStatus = 'changed';
            gateData.assignedGate = '12A';
            gateData.predictedGate = '4D'; // Changed
            gateData.colorCode = 'Red';
            gateData.alert = true;
            gateData.message = 'Gate Changed to 4D!';
        }

        res.json(gateData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
