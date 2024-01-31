import express from "express";

import {
  getFeedbacks,
  getFeedback,
  addFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../controllers/feedbacksController.js";

import Feedback from "../../models/Feedback.js";

import { advancedResults } from "../../middleware/advancedResults.js";
// import { verifyJWT } from "../middleware/verifyJWT.js";

// Merged documentation: Preserve the req.params values from the parent router.
// If the parent and the child have conflicting param names, the child’s value take precedence.
// @default false
const router = express.Router({ mergeParams: true });

// router.use(verifyJWT)

router
  .route("/")
  .get(
    advancedResults(Feedback, {
      path: "helper",
      // select: "username",
    }),
    getFeedbacks
  )
  .post(addFeedback);

router
  .route("/:id")
  .get(getFeedback)
  .put(updateFeedback)
  .delete(deleteFeedback);

export default router;
