import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import Helper from "../models/Helper.js";


// import { advancedResults }  from "../middleware/advancedResults.js";

// @desc    Get all users
// @router  GET /users
// @access  Private/Admin
const getUsers = async (req, res, next) => {     
    const users = await User.find().select('-password').lean()
    
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.status(200).json(users);
  };
  
// @desc    Create user
// @router  POST /users
// @access  Private/Admin
const createUser = async (req, res, next) => {  
  console.log("CREATE USER: ", req.body)
  const { username, password, email, roles } = req.body

    // Confirm data
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' })
  }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 6) //  salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "password": hashedPwd }
        : { username, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create({...userObject, email})

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
  }
};


// @desc    Update user
// @router  PUT /users
// @access  Private/Admin
const updateUser = async (req, res) => {
  console.log("UPDATE USER!")
  const { id, username, roles, password } = req.body

  // Confirm data 
  if (!id || !username || !Array.isArray(roles) || !roles.length) {
      return res.status(400).json({ message: 'All fields except password are required' })
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec()

  if (!user) {
      return res.status(400).json({ message: 'User not found' })
  }

  // Check for duplicate 
  const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

  // Allow updates to the original user 
  if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate username' })
  }

  user.username = username
  user.roles = roles
  // user.active = active

  if (password) {
      // Hash password 
      user.password = await bcrypt.hash(password, 6) // salt rounds 
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} updated` })
  };

  

// @desc    Delete user
// @router  DELETE /users/
// @access  Private/Admin
const deleteUser = async (req, res, next) => {  
  const { id } = req.body

  // Confirm data
  if (!id) {
      return res.status(400).json({ message: 'User ID Required' })
  }

  // Does the user still have assigned Helper schema?
  const helper = await Helper.findOne({ _id: id }).lean().exec()
  if (helper) {
      return res.status(400).json({ message: 'User has assigned notes' })
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec()

  if (!user) {
      return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne()

  const reply = `Username ${result.username} with ID ${result._id} deleted`

  res.json(reply)
  };
  
  export {getUsers, createUser, updateUser, deleteUser}