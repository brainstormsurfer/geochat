import express from "express";

import {
  getHelpers,
  getHelper,
  createHelper,
  updateHelper,
  deleteHelper,
  getHelpersInRadius,
  helperPhotoUpload,
} from "../../controllers/helpersController.js";

import Helper from "../../models/Helper.js";

// Include other events routers
import eventsRouter from "./events.js";
import feedbacksRouter from "./feedbacks.js";

// const router = express.Router();
const router = express.Router({ mergeParams: true });

import { advancedResults } from "../../middleware/advancedResults.js";
// import { verifyJWT } from "../middleware/verifyJWT.js";

  
// router.use(verifyJWT)

// Re-route into other resource routers
router.use("/:helperId/events", eventsRouter);
router.use("/:helperId/feedbacks", feedbacksRouter);


// getting events/feedbacks for a specific helper (not using advanced results
// via helper's reverse populate with virtuals,
// And via the {mergeParams: true} feedbacksRouter property

router.route("/radius/:zipcode/:distance").get(getHelpersInRadius);

router
  .route("/:id/photo")
  .put(helperPhotoUpload);


  
router
  .route("/") 
  .get(advancedResults(Helper, "events"), getHelpers)
    // Get helpers for a specific event (not using advancedResults)
    // (via event's reverse populate with virtuals)
    // And via the {mergeParams: true}    
  .post(createHelper);

router
  .route("/:id")
  .get(getHelper)
  .put(updateHelper)
  .delete(deleteHelper);


export default router;
