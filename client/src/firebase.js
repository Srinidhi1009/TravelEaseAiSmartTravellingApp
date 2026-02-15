import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBdY3yHn7woW3oivTzE-iyMKGrX_-BHN0A",
    authDomain: "travelease-app-2024-db.firebaseapp.com",
    projectId: "travelease-app-2024-db",
    storageBucket: "travelease-app-2024-db.firebasestorage.app",
    messagingSenderId: "428350140445",
    appId: "1:428350140445:web:ce16cf68bbd52dc17616f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
