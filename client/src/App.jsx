import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import { Cabs } from './pages/Placeholder';
import AIPlanner from './pages/AIPlanner';
import Analytics from './pages/Analytics';

import BookingSuccess from './pages/BookingSuccess';
import ManualPlanner from './pages/ManualPlanner';
import Payment from './pages/Payment';
import HotelDetails from './pages/HotelDetails';
import FlightDetails from './pages/FlightDetails';

import TripDashboard from './pages/TripDashboard';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-transparent font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <Navbar />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/flights/:id" element={<FlightDetails />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />


              {/* Protected Routes */}
              <Route path="/basic-planner" element={<ProtectedRoute><ManualPlanner /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><TripDashboard /></ProtectedRoute>} />
              <Route path="/ai-planner" element={<ProtectedRoute><AIPlanner /></ProtectedRoute>} />
              <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            </Routes>

            <Chatbot />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
