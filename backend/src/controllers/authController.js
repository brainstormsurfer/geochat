// Authentication
import User from "../models/User.js";

import bcrypt from "bcrypt";
import { newHelperHandler } from "../utils/newHelperHandler.js";
import { generateAccessToken } from "../utils/tokenUtils.js";
// import { ConnectionClosedEvent } from "mongodb";

// @desc    Login user
// @route   POST /auth
// @access  Public

export const handleLogin = async (req, res) => {
  console.log("AAAUUUUTH req.body: ", req.body)
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required." });
  }
  
  const foundUser = await User.findOne({ username }).exec();
  console.log("FOUNDUSER!", foundUser)

  if (
    !foundUser
    // || !foundUser.active
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });
  // Check if user role updated to "helper";  if "helper" role added by admin who add "helper" role to a user, when this user's logging in - create a Helper model for this user
  if (foundUser.roles.includes("helper")) {
    console.log("HELPER CHECKING - if");
    const loginResult = await newHelperHandler(foundUser);
    if (loginResult.success) {
      const accessToken = await generateAccessToken(
        loginResult.success,
        loginResult.data || foundUser
      ); // Pass data if available
      res.json({ accessToken });
    } else {
      console.error("Error creating Helper model:", loginResult.error);
      // TODO: Handle error ?
    }
  } else {
    const accessToken = await generateAccessToken(foundUser, res);
    res.json({ accessToken });
  }
};
