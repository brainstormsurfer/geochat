import User from '../models/User.js';
import { generateAccessToken } from "../utils/tokenUtils.js";

// @desc    Guest user
// @router  POST /guest
// @access  Public
export const guestUser = async (req, res, next) => {
    try {
      const guestDetails = {
        username: `guest_${Date.now()}`,
        email: `guest${Math.random()}@example.com`,
        password: "guestPassword",
      };
  
      // Create guest user
      const guestUser = await User.create(guestDetails);
  
      // Update user role to "guest"
      const guest = await User.findOneAndUpdate(
        { _id: guestUser._id },
        { role: "guest" },
        { new: true }
      );
  
      const accessToken = await generateAccessToken(guest);
      res.json({ accessToken });
    } catch (error) {
      console.error("Error handling guest user:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };
