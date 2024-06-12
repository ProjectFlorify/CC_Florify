require('dotenv').config();
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser } = require('./controller/userController');
const { verifyToken } = require('./middleware/userMiddleware');
const postPrediction = require('./controller/mlController');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Get user route
router.get('/user', verifyToken, getUser);

// Logout route
router.post('/logout', logoutUser);

// Predict route
router.post('/predict', postPrediction)

module.exports = router;
