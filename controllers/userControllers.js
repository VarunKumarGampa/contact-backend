const asycnHandler = require("express-async-handler")
const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { hash } = require("bcrypt");

const registerUser = asycnHandler(async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Enter all the mandatory fields!")
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400)
        throw new Error("User already registered!")
    }

    //Hashing Password
    const hashedPassword = await bcrypt.hash(password,10)
    console.log("hashed password: ",hashedPassword );
    const user = await User.create({
        username,email, password:hashedPassword
    })
    console.log(user)
    if(user){
        res.json({_id:user._id,email:user.email})
    }
    else{
        res.status(400)
        throw new Error("User data is not valid ")
    }

    // res.status(200).json({message:"register the user"})
})

const loginUser = asycnHandler(async(req,res)=>{
    const  {email,password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("Please enter mandatory fields!")
    }
    const user = await User.findOne({email})
    //comapare the hash password
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user:{
                username : user.username,
                password: user.password,
                id:user._id
            }
        },
        process.env.JWT_KEY,
        {expiresIn:"30d"})
        res.status(200).json({accessToken})
    }
    else{
        res.status(401)
        throw new Error("Invalid user")
    }
    
})

const currentUser = asycnHandler(async(req,res)=>{
    res.status(200).json(req.user)
});

module.exports = {registerUser,loginUser,currentUser}