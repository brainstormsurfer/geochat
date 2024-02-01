// Authentication
import User from "../models/User.js";

import bcrypt from "bcrypt";
import newHelperHandler  from "../utils/newHelperHandler.js";
import { generateAccessToken } from "../utils/tokenUtils.js";
// import { ConnectionClosedEvent } from "mongodb";

// @desc    Login user
// @route   POST /auth
// @access  Public

export const login = async (req, res) => {
  console.log("AAAUUUUTH req.body: ", req.body)
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required." });
  }
  
  const foundUser = await User.findOne({ username }).exec();
  console.log("[auth] FOUND USER:", foundUser)

  if (!foundUser
    // || !foundUser.active
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if user role 'helper' is being given by admin in purpose to create a related schema
  if (foundUser.roles.includes("helper")) {
    const loginResult = await newHelperHandler(foundUser);
    if (loginResult && loginResult.success) {
      console.log("Helper schema has been created");
    } else {
      console.log("user already had a Helper schema");
    }
    // if (loginResult.success) {
    //   console.log("newHelperHandler respond:", loginResult)
    // }
  } 

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = await generateAccessToken(foundUser, res);
    res.json({ accessToken });
  // }
};
