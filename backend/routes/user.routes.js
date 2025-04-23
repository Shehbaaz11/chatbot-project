const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { body } = require("express-validator");

// Register a new user
router.post('/register', [
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .trim().escape(),
    body('email')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
],
userController.registerUser
);

// Test endpoint for register
router.get('/register', (req, res) => {
    console.log('Touched 8282/register get route');
    res.send('Register endpoint is working!');
});

// Login user
router.post('/login', [
    body('email')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
],
userController.loginUser
);

// Test endpoint for login
router.get('/login', (req, res) => {
    console.log('Touched 8282/login get route');
    res.send("Login endpoint is working!");
});

// Get user profile
router.get('/profile/:userId', userController.getUserProfile);

module.exports = router;