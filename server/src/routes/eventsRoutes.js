import express from "express";

import {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventsController.js";

import Event from "../models/Event.js";

// Docs of merged: Preserve the req.params values from the parent router.
// If the parent and the child have conflicting param names, the child’s value take precedence.
//  @default false
const router = express.Router({ mergeParams: true });

import { advancedResults } from "../middleware/advancedResults.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(
    advancedResults(Event, {
      // Get all events
      path: "helper",
      select: "username description",
    }),
    getEvents // Get events for a specific helper (not using advancedResults)
    // (via helper's reverse populate with virtuals)
    // And via the {mergeParams: true}
  )
  .post(protect, authorize("publisher", "admin"), addEvent);

router
  .route("/:id")
  .get(getEvent)
  .put(protect, authorize("publisher", "admin"), updateEvent)
  .delete(protect, authorize("publisher", "admin"), deleteEvent);

export default router;
