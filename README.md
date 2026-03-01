# TravelEase AI – Smart Travelling App

TravelEase AI is a modern AI-powered travel planning and booking platform designed to help users plan, manage, and book their trips efficiently. The application integrates AI-based trip planning, intelligent chat assistance, real-time cost estimation, and booking systems in a responsive interface built with modern web technologies.

The platform supports two main trip planning approaches: an AI-powered automated planner and a manual planning system where users can build their itinerary step by step.

---

# Project Overview

TravelEase AI provides a unified travel management platform where users can:

* Plan trips using an AI assistant
* Manually customize travel itineraries
* Book flights and hotels
* Monitor travel expenses and analytics
* Manage bookings and itineraries
* Interact with a smart travel chatbot
* Complete secure payments

The interface uses modern design principles including glassmorphism, animated UI components, and responsive layouts.

---

# Application Screenshots


### Homepage

![Homepage](screenshots/homepage.png)

### AI Trip Planner

![AI Planner](screenshots/ai-planner.png)

### Travel Buddy Chatbot

![Chatbot](screenshots/chatbot.png)

### Flight Booking System

![Flights](screenshots/flights.png)

### Hotel Booking System

![Hotels](screenshots/hotels.png)

### User Dashboard

![Dashboard](screenshots/dashboard.png)

### Trip Analytics

![Analytics](screenshots/analytics.png)

### Payment Interface

![Payment](screenshots/payment.png)

---

# Key Features
Add the following **professional sections** to the bottom of your `README.md`. Since you wanted a **professional style**, I removed emojis and formatted it cleanly.

---

## Designed for Indian Travelers

TravelEase AI is designed with a focus on travelers across India.
The platform aims to make trip planning simpler, faster, and smarter by integrating intelligent planning tools, localized language support, and a streamlined booking experience.

Travel smarter. Travel easier. Travel with AI.

---

## Supported Languages

The application supports multiple Indian languages to make travel planning accessible to a wider audience.

* English
* Hindi
* Tamil
* Telugu
* Bengali
* Marathi
* Gujarati
* Kannada
* Malayalam
* Punjabi
* Odia
* Assamese
* Urdu

All user interface text is dynamically translated while ensuring that **numerical values such as prices, dates, and counts remain unchanged**.

## AI Trip Planner

The AI Trip Planner provides a conversational interface that generates complete travel itineraries based on user preferences.

Features include:

* Step-by-step interactive trip planning
* Live trip cost calculation
* Budget comparison indicators
* Dynamic pricing estimation
* Travel class and accommodation selection

Variables considered in cost estimation include flights, hotels, transportation, sightseeing activities, and travel class.

Primary component:

```
AIPlanner.jsx
```

---

## Smart Travel Buddy Chatbot

The application includes a floating AI chatbot that assists users throughout the platform.

Capabilities include:

* Natural language intent recognition
* Context-aware responses
* Travel assistance during bookings and trips

Interactive features within chat include:

* Weather forecasts for destinations
* Flight and gate status information
* Place recommendations
* Booking cards with electronic ticket viewing
* Trip switching between active bookings

Primary component:

```
ChatBot.jsx
```

---

## Flight Booking Engine

The flight booking module allows users to search and reserve flights.

Features include:

* Destination-based search
* Date selection
* Passenger configuration
* Seat map selection
* Travel class selection

Important components:

```
Flights.jsx
SeatMap.jsx
```

---

## Hotel Booking Engine

The hotel booking system allows users to browse and book hotels based on their preferences.

Capabilities include:

* Hotel star rating selection
* Room type selection
* Budget filtering
* Integration with trip planner

Main component:

```
Hotels.jsx
```

---

## Dual Planning Modes

TravelEase supports two different planning workflows.

### AI Planner

Automatically generates travel itineraries using AI.

Component:

```
AIPlanner.jsx
```

### Manual Planner

Allows users to manually assemble travel plans.

Component:

```
ManualPlanner.jsx
```

---

# User Dashboard and Analytics

## Trip Dashboard

Displays current and upcoming trips with itinerary information.

```
TripDashboard.jsx
```

## My Bookings

Shows booking history and upcoming reservations.

```
MyBookings.jsx
```

## Travel Analytics

Provides visual insights into travel expenses using charts.

Displayed metrics include:

* Flight costs
* Hotel expenses
* Transportation costs
* Additional travel expenses

```
Analytics.jsx
```

---

# Payment System

The payment module manages final booking confirmations and payment processing.

Supported payment methods include:

* Credit cards
* UPI
* Netbanking

Features include cost breakdown summaries and a secure checkout process.

Component:

```
Payment.jsx
```

---

# Localization and Internationalization

The platform supports multiple languages using the i18n framework.

Features include:

* Automatic language detection
* Support for multiple regional languages
* Right-to-left layout support for Urdu

Libraries used:

```
react-i18next
i18next-browser-languagedetector
```

---

# Authentication System

User authentication is managed through Firebase Authentication.

Capabilities include:

* Secure user registration
* Login authentication
* Google OAuth integration
* JWT-based session management
* Firestore synchronization for user data

Core file:

```
AuthContext.jsx
```

---

# Architecture Overview

```
TravelEase
│
├── client
│   ├── components
│   │   ├── ChatBot.jsx
│   │   ├── SeatMap.jsx
│   │
│   ├── pages
│   │   ├── AIPlanner.jsx
│   │   ├── ManualPlanner.jsx
│   │   ├── Flights.jsx
│   │   ├── Hotels.jsx
│   │   ├── Payment.jsx
│   │   ├── TripDashboard.jsx
│   │   ├── MyBookings.jsx
│   │   └── Analytics.jsx
│   │
│   └── context
│       └── AuthContext.jsx
│
├── server
│   ├── routes
│   ├── controllers
│   ├── middleware
│   └── firebaseAdmin.js
```

---

# Technology Stack

## Frontend

* React 19
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* Recharts
* Lucide React

## Backend

* Node.js
* Express.js
* Firebase Admin SDK
* JWT Authentication
* bcryptjs

## Database

* Firebase Firestore

---

# Installation

## Clone the Repository

```
git clone https://github.com/yourusername/travelease-ai.git
cd travelease-ai
```

---

## Install Frontend Dependencies

```
cd client
npm install
```

---

## Install Backend Dependencies

```
cd server
npm install
```

---

## Configure Environment Variables

Create `.env` files for both frontend and backend.

Example backend configuration:

```
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
JWT_SECRET=
```

---

## Run the Application

Start backend server:

```
cd server
npm run dev
```

Start frontend development server:

```
cd client
npm run dev
```

---

# Performance Optimization

The application implements several React optimization strategies:

* Memoization using `useMemo`
* Optimized event handlers using `useCallback`
* Lazy loading of components
* Efficient Firestore queries
* Optimized animations with Framer Motion

---

# Future Enhancements

Potential future improvements include:

* Integration with external flight APIs
* AI-based travel recommendation engine
* Map-based itinerary visualization
* Real-time travel alerts
* Offline itinerary access
* Dynamic price tracking

---

# License

This project is licensed under the MIT License.

---
## Author

**Srinidhi**

GitHub:
[https://github.com/Srinidhi1009](https://github.com/Srinidhi1009)

---
