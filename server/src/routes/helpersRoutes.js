import express from "express";

import {
  getHelpers,
  getHelper,
  createHelper,
  updateHelper,
  deleteHelper,
  getHelpersInRadius,
  helperPhotoUpload,
} from "../controllers/helpersController.js";

import Helper from "../models/Helper.js";

// Include other events routers
import eventsRouter from "./eventsRoutes.js";
import feedbacksRouter from "./feedbacksRoutes.js";

const router = express.Router();

import { advancedResults } from "../middleware/advancedResults.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

// Re-route into other resource routers
router.use("/:helperId/events", eventsRouter);
router.use("/:helperId/feedbacks", feedbacksRouter);
// getting events/feedbacks for a specific helper (not using advanced results
// via helper's reverse populate with virtuals,
// And via the {mergeParams: true} feedbacksRouter property

router.route("/radius/:zipcode/:distance").get(getHelpersInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), helperPhotoUpload);

router
  .route("/")
  .get(advancedResults(Helper, "events"), getHelpers)
  .post(protect, authorize("publisher", "admin"), createHelper);

router
  .route("/:id")
  .get(getHelper)
  .put(protect, authorize("publisher", "admin"), updateHelper)
  .delete(protect, authorize("publisher", "admin"), deleteHelper);

export default router;
