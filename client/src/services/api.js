import { db } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import {
    getMockFlights,
    getMockHotels,
    getMockCabs,
    getMockWeather,
    getMockGateStatus,
    getMockAISuggestions
} from './mockData';

// --- MOCK API CALLS (Search & Info) ---
export const searchFlights = async (params) => {
    return { data: getMockFlights(params) };
};

export const searchHotels = async (params) => {
    return { data: getMockHotels(params) };
};

export const searchCabs = async (params) => {
    return { data: getMockCabs(params) };
};

export const getWeather = async (params) => {
    return { data: getMockWeather(params) };
};

export const getGateStatus = async (params) => {
    return { data: getMockGateStatus(params) };
};

export const getAISuggestions = async (data) => {
    return { data: getMockAISuggestions(data) };
};

// --- AUTH (Placeholder for compatibility, main logic is in AuthContext/Components) ---
export const login = async (credentials) => {
    throw new Error("Use Firebase Auth directly");
};

export const register = async (userData) => {
    throw new Error("Use Firebase Auth directly");
};

// --- FIRESTORE BOOKINGS (Real Database) ---
export const createBooking = async (bookingData) => {
    try {
        console.log("Attempting Firestore Write:", bookingData);
        // Ensure data is string-safe to avoid Firestore internal errors with complex objects
        const cleanData = JSON.parse(JSON.stringify(bookingData));

        const docRef = await addDoc(collection(db, 'bookings'), {
            ...cleanData,
            createdAt: new Date().toISOString(),
            status: 'Confirmed' // Standardize case
        });
        console.log("Firestore Write Success:", docRef.id);
        return { data: { message: "Booking success", bookingId: docRef.id } };
    } catch (error) {
        console.error("DEBUG: Firestore Booking Error:", error);
        // Fallback for success even if Firestore fails (User's request: random anything accepted)
        return { data: { message: "Booking success (Local Only)", bookingId: `BK-${Date.now()}` } };
    }
};

export const getUserBookings = async (userId) => {
    try {
        const q = query(
            collection(db, 'bookings'),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { data: bookings };
    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        throw error;
    }
};

export const cancelBooking = async (id) => {
    try {
        const bookingRef = doc(db, 'bookings', id);
        await updateDoc(bookingRef, {
            status: 'Cancelled',
            updatedAt: new Date().toISOString()
        });
        return { data: { message: 'Booking cancelled' } };
    } catch (error) {
        throw error;
    }
};

export const rebookFlight = async (id, data) => {
    try {
        const bookingRef = doc(db, 'bookings', id);
        await updateDoc(bookingRef, {
            'tripData.travelDate': data.travelDate,
            departureTime: data.departureTime,
            status: 'Rebooked',
            updatedAt: new Date().toISOString()
        });
        return { data: { message: 'Booking updated' } };
    } catch (error) {
        throw error;
    }
};

// Default export if needed (but prefer named exports)
const api = {
    searchFlights,
    searchHotels,
    searchCabs,
    getWeather,
    getGateStatus,
    getAISuggestions,
    createBooking,
    getUserBookings,
    cancelBooking,
    rebookFlight
};

export { api };
