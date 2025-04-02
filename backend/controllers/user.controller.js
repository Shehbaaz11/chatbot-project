const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
module.exports.registerUser = async (req,res,next) => {
    const {username,email,password} = req.body;
    const isAlreadyUser = await userModel.findOne({email});
    if(isAlreadyUser){
        return res.status(400).json({message: 'Email is already registered.'});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    try {
        const user = userModel.create({
            username,
            email,
            password: hashedPassword
        })
        res.status(201).json({message: `User ${username} created successfully.`});
    }
    catch(err){
        console.log(err);
    }
}
module.exports.loginUser = async (req,res,next) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(400).json({message: 'Invalid email or password.'});
    }
    try{
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(isValidPassword){
            res.status(200).json({message: 'User logged in successfully.'});
        }
    }
    catch(err){
        console.log(err);
    }
}