import Helper from "../models/Helper.js";
export const handleLogin = async (user) => {
    try {
      // Check if the user has a "helper" role
      if (user.role === "helper") {
        let helper = await Helper.findOne({ _id: user._id });
  
        // Create a new Helper document only if it doesn't exist
        if (!helper) {
          const newHelper = await Helper.create({
            _id: user._id,
            description: "Added by admin. Please edit...",
          });
          console.log("Helper instance created for user:", user._id);
          return { success: true, data: newHelper, user };
        } else {
          console.log("Helper instance already exists for user:", user._id);
        }
      }
  
      // Continue with the default login response
      return { success: true, user };
    } catch (error) {
      console.error("Error handling login:", error);
      return { success: false, error: "Internal Server Error" };
    }
  };
  