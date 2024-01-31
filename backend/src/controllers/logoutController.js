import User from "../models/User.js";

// @desc    Log user out / clear cookies
// @router  GET /auth/logout
// @access  Private
export const handleLogout = async (req, res, next) => {
  if (req.user && req.user.role === "guest") {
    // If the user is a guest, remove the user from the database
    await User.findByIdAndDelete(req.user._id);
  }

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
