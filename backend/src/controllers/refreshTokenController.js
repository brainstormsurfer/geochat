import User from "../models/User.js";
import jwt from "jsonwebtoken";

// @desc Refresh token
// @route GET /auth/refresh
// @access Public - because access token has expired
export const refreshToken = async (req, res) => {
  console.log("in REFRESH TOKEN, cookies: ");

  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ message: "Unauthorized. Missing refresh token" });

      console.log("cookies.jwt",cookies.jwt)
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden." });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();
      
      if (!foundUser)
        return res
          .status(401)
          .json({ message: "Unauthorized. Invalid refresh token." });
          
          const accessToken =  jwt.sign(
            {
              "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRE }
            );
            
            res.json({ accessToken });
          }
        );
};