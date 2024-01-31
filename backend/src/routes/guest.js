import express from "express";
const router = express.Router();
import { guestUser } from "../controllers/guestController.js";
import { loginLimiter } from "../middleware/loginLimiter.js";

router.route('/guest').post(loginLimiter, guestUser);

export default router;
