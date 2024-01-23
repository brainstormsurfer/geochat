import express from "express";

import {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventsController.js";

import Event from "../models/Event.js";

import { advancedResults } from "../middleware/advancedResults.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

// import helpersRouter from "./helpersRoutes.js"

// Use dynamic import to get helpersRouter as a promise
const helpersRouterPromise = import('./helpersRoutes.js');

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Event, {
      path: "helper",
      select: "mobility description",
    }),
    getEvents // Get events for a specific helper (not using advancedResults)
    // (via helper's reverse populate with virtuals)
  )
  .post(protect, authorize("publisher", "helper", "admin"), addEvent)
  
  router
  .route("/:id")
  .get(getEvent)
  .put(protect, authorize("publisher", "helper", "admin"), updateEvent)
  .delete(protect, authorize("publisher", "helper", "admin"), deleteEvent);

export default router;
