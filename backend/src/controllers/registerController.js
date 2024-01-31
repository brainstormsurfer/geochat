import User from "../models/User.js";
import bcrypt from "bcrypt";

// @desc    Register user
// @route   POST /register
// @access  Public
export const handleNewUser = async (req, res) => {
  console.log("REGISTER!")
  const { username, email, password } = req.body;
  if (!username || !password || !email)
    return res.status(400).json({ message: "All fields are required." });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 6);

    //create and store the new user
    const user = await User.create({
      username: username,
      password: hashedPwd,
      email: email,
    });

    console.log("registered user:", user);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
