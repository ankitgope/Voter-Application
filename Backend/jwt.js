const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = (req, res, next) => {
  // first check if request headers has authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token Not Found" });

  //   Extract the token from the request headers
  const token = authorization.split(" ")[1];
  if(!token) return res.status(401).json({error:'unauthorized'})

    try {
        // verify the JWT token
        const decode = jwt.verify(token ,process.env.JWT_SECRET);

        // Attach user information to the request object 
        req.user =decode;
        next();

    } catch (err) {
        console.error(err)
        res.status(401).json({error:'Invalid token'})
    }
};

// Functon to generate JWT token
const generateToken=(userData)=>{
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000})
}

module.exports={jwtAuthMiddleware,generateToken}

