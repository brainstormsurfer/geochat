import express from "express";
const router = express.Router();

import {
  login,
  logout,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  resetPassword,
} from "../controllers/index.js";
import { loginLimiter } from "../middleware/loginLimiter.js";

// Authentication Routes - localhost:5000/auth
router.route(
  // loginLimiter,
   "/")
.post(login)

// .../auth/refresh
router.get("/refresh", refreshToken);

// .../auth/logout
router.post("/logout", logout);

// .../auth/profile
router.route("/profile")
.get(getUserProfile)
.put(updateUserProfile);

// .../auth/reset-password/:jwt
router.put("/reset-password/:resettoken", resetPassword);


export default router;