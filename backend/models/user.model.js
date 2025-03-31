const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: [3, 'Username must be atleast 3 characters long.']
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be atleast 5 characters long.']
    },
    password:{
        type: String,
        required: true,
        minlength: [6, 'Password must be atleast 6 characters long.'],
        select: false
    }
})

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;