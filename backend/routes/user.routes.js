const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {body} = require("express-validator");

router.post('/register', [
    body('username').isLength({min: 3}).withMessage('Username must be atleast 3 characters long.'),
    body('email').isEmail().withMessage('Email must be atleast 5 characters long.'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast 6 characters long.')
],
userController.registerUser
);

router.get('/register', (req,res) => {
    console.log('Touched 8383/register get route');
    res.send('Register endpoint is working!');
})
module.exports = router;