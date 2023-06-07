const jwt = require ("jsonwebtoken");
const {config} = require ("../config/secret");

exports.auth = async(req,res,next) => {
    let token = req.header("x-api-key");
    if (!token){
        return res.status(401).json({msg:"no token sent."})
    }

    try{
        let tokenData = jwt.verify(token,config.tokenSecret);
        req.tokenData = tokenData;
        next();
    }
    catch (err){
        return res.status(401).json({msg:"invalid token / expired token"});
    }
}

exports.authAdmin = (req,res,next) => {
    let token = req.header("x-api-key");
    if(!token){
      return res.status(401).json({msg:"no token sent."})
    }
    try{
      let tokenData = jwt.verify(token,config.tokenSecret);
      // check if the role in the token of admin
      if(tokenData.role != "admin"){
        return res.status(401).json({msg:"Access denied. Admins only."})
      }
      req.tokenData = tokenData;
      next();
    }

    catch(err){
      console.log(err);
      return res.status(401).json({msg:"invalid token / expired token"})
    }
  }