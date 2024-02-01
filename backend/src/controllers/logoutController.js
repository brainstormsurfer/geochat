import User from "../models/User.js";

// @desc    Log user out / clear cookies
// @router  GET /auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  console.log("in LOGOUT")
  if (req.user && req.user.role === "guest") {
    // If the user is a guest, remove the user from the database
    await User.findByIdAndDelete(req.user._id);
    console.log("guest logged out and been deleted")
  }
  
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
