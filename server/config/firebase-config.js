const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

let serviceAccount;

try {
    // Look for serviceAccountKey.json in the server root (one level up from config)
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    serviceAccount = require(serviceAccountPath);
    console.log("Found Service Account Key at:", serviceAccountPath);
} catch (e) {
    console.warn("No serviceAccountKey.json found in server root.", e.message);
}

if (!admin.apps.length) {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin Initialized with Service Account");
    } else {
        console.warn("WARNING: Initializing Firebase without credentials. Firestore will likely fail.");
        admin.initializeApp({
            projectId: 'travelease-app-2024-db' // Fallback project ID
        });
    }
}

const db = admin.firestore();
module.exports = { admin, db };
