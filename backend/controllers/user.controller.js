const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d' // Token expires in 30 days
    });
};

module.exports.registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Log the request body for debugging
    console.log('Registration request:', { username, email, password: password ? '****' : undefined });

    try {
        // Check for validation errors from express-validator
        const { validationResult } = require('express-validator');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if email already exists
        const isAlreadyUser = await userModel.findOne({ email });
        if (isAlreadyUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(newUser._id);

        console.log('User created successfully:', username);
        res.status(201).json({
            message: `User ${username} created successfully.`,
            userId: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

module.exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Log the login attempt for debugging
    console.log('Login attempt:', { email, password: password ? '****' : undefined });

    try {
        // Check for validation errors from express-validator
        const { validationResult } = require('express-validator');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate token
        const token = generateToken(user._id);

        console.log('User logged in successfully:', email);
        res.status(200).json({
            message: 'User logged in successfully.',
            userId: user._id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Get user profile
module.exports.getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            userId: user._id,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching user profile.' });
    }
};