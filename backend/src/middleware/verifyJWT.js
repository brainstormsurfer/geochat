import jwt from "jsonwebtoken";

// Verifying access token before protected routes
export const verifyJWT = (req, res, next) => {
  console.log("in VERIFY TOKEN, cookies: ")

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const accessToken = authHeader.split(" ")[1];  
  
  jwt.verify(
    accessToken, 
    process.env.ACCESS_TOKEN_SECRET, 
    (err, decoded) => {    
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.username; 
    req.roles = decoded.UserInfo.roles;
    next();
  });
};
