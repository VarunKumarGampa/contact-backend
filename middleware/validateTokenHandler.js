const asycnHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const validateToken = asycnHandler(async(req,res,next)=>{
    let token;
    let authHandler = req.headers.Authorization || req.headers.authorization
    if(authHandler && authHandler.startsWith("Bearer")){
        token = authHandler.split(" ")[1];
        jwt.verify(token,process.env.JWT_KEY,(err,decoded)=>{
            if(err){
                res.status(401)
                throw new Error("User is not authorized")
            }
            else{
                req.user = decoded.user
                next()
            }
        })
    }
    if(!token){
        res.status(401)
        throw new Error("User is not authorized or token is missing")
    }
})

module.exports = validateToken;