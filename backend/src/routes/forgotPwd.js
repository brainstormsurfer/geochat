import express from "express";
const router = express.Router();
import { forgotPassword } from "../controllers/passwordController.js";


router.post("/forgot-password", forgotPassword);

export default router;