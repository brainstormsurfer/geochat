// Authentication
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "./../middleware/asyncHandler.js";
import User from "../models/User.js";
// import Helper from "../models/Helper.js";

import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { sendTokenResponse } from "../utils/sendTokenResponse.js";
import { handleLogin } from "../utils/handleLogin.js";

// @desc    Guest user
// @router  POST /api/v1/auth/guest
// @access  Public
const guest = asyncHandler(async (req, res, next) => {
  try {
    const guestDetails = {
      username: `guestUser_${Date.now()}`,
      email: `guest${Math.random()}@example.com`,
      password: "guestPassword",
    };

    // Create guest user
    const guestUser = await User.create(guestDetails);

    // Update user role to "guest"
    const updatedGuestUser = await User.findOneAndUpdate(
      { _id: guestUser._id }, // Use a unique identifier, like _id
      { role: "guest" },
      { new: true } // Return the updated document
    );

    // Get JWT token
    const token = updatedGuestUser.getSignedJwtToken();

    res
      .status(200)
      .json({ success: true, message: { token, guestUser: updatedGuestUser } });
  } catch (error) {
    console.error("Error handling guest user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// @desc    Register user
// @router  POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Create user (from the model static function - create)
  const user = await User.create({
    username,
    email,
    password,
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    // Important to return the same error message so no one can know the reason for login failure
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Continue with the login process and handle additional logic
  const loginResult = await handleLogin(user);

  if (loginResult.success) {
    // Send token to client
    sendTokenResponse(loginResult.user, 200, res);
  }
});

// @desc    Log user out / clear cookie
// @router  GET /api/v1/auth/logout
// @access  Private

const logout = asyncHandler(async (req, res, next) => {
  console.log("Logout Request:", req.user);

  if (req.user && req.user.role === "guest") {
    await User.findByIdAndDelete(req.user._id);
  }

  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    GET current logged in user
// @router  GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  // const user = await User.findById(req.user.id);
  const user = req.user; // (protect)

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @router  PUT /api/v1/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @router  PUT /api/v1/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  console.log("PUT user", user);
  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forget Password
// @router  POST /api/v1/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has
  requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    // Temporary in DB, and only for the purpose of resetting -
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Reset Password
// @router  POST /api/v1/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  // when we set a field to undefined - it just "goes away"
  user.resetPasswordToken = undefined; // (*get encrypted in User middleware while
  // "if (!this.isModified('password')" WON'T fire off due to the password modification)
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

export {
  guest,
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
};
