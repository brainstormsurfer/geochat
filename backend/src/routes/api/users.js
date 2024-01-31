import express from "express";
import User from "../../models/User.js";
import {
  getUsers,
  // getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/usersController.js";
import { advancedResults } from "../../middleware/advancedResults.js";

const router = express.Router({ mergeParams: true });

// advancedResults takes a model (and a populate which we don't need here)
// router.route("/").get(advancedResults(User), getUsers)
// .post(createUser);

router
  .route('/')
  .get(advancedResults(User), getUsers)
  // .get(getUser)
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
