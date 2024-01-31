import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from "../utils/tokenUtils.js";

// @desc Refresh token
// @route GET /auth/refresh
// @access Public - because access token has expired
export const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).json({ message: "Missing refresh token" });

  try {
    const refreshToken = cookies.jwt;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const foundUser = await User.findOne({ username: decoded.username }).exec();

    if (!foundUser)
      return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = await generateAccessToken(foundUser);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid token or error" });
  }
};
