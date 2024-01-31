import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { generateAccessToken } from "../utils/tokenUtils.js";

// @desc    Forget Password
// @router  POST /forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
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
  )}/auth/resetpassword/${resetToken}`;

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
};

// @desc    Reset Password
// @router  POST /auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
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

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const accessToken = await generateAccessToken(user, 200, res);
  res.json({ accessToken });
};

export { forgotPassword, resetPassword };
