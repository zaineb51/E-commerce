const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const token = req.headers["authorization"];
    if(!token){
        return res.status(401).json({
            message: "no token",
            success: false
        })
    }
    jwt.verify(token, process.env.SECRET, (err,decoded) => {
    if(err){
        return res.status(401).json({
            message:"unauthorized",
            success: false,
            error: err
        })
    }
    req.user = decoded;
    return next();
   });
   
}
module.exports = auth;
