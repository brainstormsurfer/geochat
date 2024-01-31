import {
  getEvents,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../../controllers/eventsController.js";

import Event from "../../models/Event.js";

import express from "express";
import { advancedResults } from "../../middleware/advancedResults.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Event, {
      path: "helper",
      select: "mobility",
    }),getEvents)
    .post(
      // protect, 
      addEvent)
  
  router
  .route("/:id")
  .get(getEvent)
  .put(
    // protect, 
    updateEvent)
  .delete(
    // protect, 
    deleteEvent);

export default router;
