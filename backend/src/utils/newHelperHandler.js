import Helper from "../models/Helper.js";
import User from "../models/User.js";

async function newHelperHandler(user) {
  console.log("new helper (role) checking");
  try {
    if (!user.roles.includes("user")) {
      // in case user has no "user" role (but only "helper", created by admin)
      const updatedUser = await User.findOneAndUpdate(
        { username: user.username },
        { $addToSet: { roles: "user" } },
        { new: true }
      );
      if (updatedUser) {
        console.log(
          "user successfully updated with a 'user' role",
          updatedUser
        );
      }
    }

    // if (!user.roles.includes("helper")) {
      const helper = await Helper.findOne({ _id: user._id });
      if (!helper) {
        const newHelper = await Helper.create({
          _id: user._id,
          description: "Added by admin. Please edit...",
        });      
        return { success: true, data: user, newHelper };
      } 
      // else {
      //   console.log("user already had a Helper schema");
      //   return { success: true, data: user, helper };
      // }
    // }
  } catch (error) {
    console.error("Error in newHelperHandler:", error);
    return { success: false, error };
  }
}

export default newHelperHandler;
