const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase-config');
const admin = require('firebase-admin');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, preferredLanguage } = req.body;

        // Check if user exists in Firestore
        const userQuery = await db.collection('users').where('email', '==', email).get();
        if (!userQuery.empty) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user document
        const newUserRef = db.collection('users').doc();
        const newUser = {
            id: newUserRef.id,
            name,
            email,
            password: hashedPassword,
            preferredLanguage: preferredLanguage || 'English',
            createdAt: new Date().toISOString()
        };

        await newUserRef.set(newUser);

        // Create JWT
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                preferredLanguage: newUser.preferredLanguage
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const userQuery = await db.collection('users').where('email', '==', email).get();

        if (userQuery.empty) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const userDoc = userQuery.docs[0];
        const user = userDoc.data();

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                preferredLanguage: user.preferredLanguage
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, name, uid } = decodedToken;

        // Check if user exists in Firestore
        let userQuery = await db.collection('users').where('email', '==', email).get();
        let user;

        if (userQuery.empty) {
            // Create new user
            const newUserRef = db.collection('users').doc();
            user = {
                id: newUserRef.id,
                name: name || 'Google User',
                email,
                googleUid: uid,
                preferredLanguage: 'English',
                createdAt: new Date().toISOString()
            };
            await newUserRef.set(user);
        } else {
            user = userQuery.docs[0].data();
        }

        // Create JWT
        const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });

        res.json({
            message: 'Google login successful',
            token: jwtToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                preferredLanguage: user.preferredLanguage
            }
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: 'Google login failed', error: error.message });
    }
};
