import Helper from "../models/Helper.js";

export const newHelperHandler = async (user) => {
  console.log("HELPER CHECKING - inside")

  try {
    if (user.roles.includes("helper")) {
      const helper = await Helper.findOne({ _id: user._id });

      if (!helper) {
        const newHelper = await Helper.create({
          _id: user._id,
          description: "Added by admin. Please edit...",
        });
        return { success: true, data: newHelper, user }; // Returns newly created Helper
      } else {
        return { success: true, data: helper, user }; // Returns existing Helper
      }
    } else {
      return { success: true, data: null, user }; // No helper role, returns null for data
    }
  } catch (error) {
    console.error("Error in newHelperHandler:", error);
    return { success: false, error };
  }
};