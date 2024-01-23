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

// const router = express.Router();
const router = express.Router({ mergeParams: true });

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
  .put(protect, authorize("helper", "admin"), helperPhotoUpload);

  
router
  .route("/") 
  .get(advancedResults(Helper, "events"), getHelpers)
    // Get helpers for a specific event (not using advancedResults)
    // (via event's reverse populate with virtuals)
    // And via the {mergeParams: true}    
  .post(protect, authorize("helper", "admin"), createHelper);

router
  .route("/:id")
  .get(getHelper)
  .put(protect, authorize("helper", "admin"), updateHelper)
  .delete(protect, authorize("helper", "admin"), deleteHelper);


export default router;
