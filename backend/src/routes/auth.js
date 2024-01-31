import express from "express";
const router = express.Router();

import {
  handleLogin,
  handleLogout,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  resetPassword,
} from "../controllers/index.js";
import { loginLimiter } from "../middleware/loginLimiter.js";

// Authentication Routes
// router.route("/")
// .post(loginLimiter,handleLogin);

// router.route("/").post(handleLogin)
router.post("/", handleLogin)
router.route("/refresh").get(refreshToken);
router.route("/logout").post(handleLogout);
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/reset-password/:resettoken", resetPassword);

// Correct: No "/auth" prefix here
// router.post('/', handleLogin);

export default router;