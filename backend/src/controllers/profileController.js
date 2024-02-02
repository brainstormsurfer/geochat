import User from "../models/User.js";

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.username._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Update user profile
// @route   PUT /auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.username._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

export { getUserProfile, updateUserProfile };
