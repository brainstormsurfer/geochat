import express from "express";
const router = express.Router({ mergeParams: true });
import {
  getEvents,
  getEvent,
  addEvent,
  addHelperToEvent,
  updateEvent,
  deleteEvent,
} from "../../controllers/eventsController.js";


import Event from "../../models/Event.js";

import { advancedResults } from "../../middleware/advancedResults.js";


router
  .route("/")
  .get(
    advancedResults(Event, {
      path: "helpers",
      select: "mobility",
    }),getEvents)
    .post(
      // protect, // TODO
      addEvent)
  
  router
  .route("/:id")
  .get(getEvent)
  .put(
    // protect,  // TODO
    updateEvent)
  .delete(
    // protect,   // TODO
    deleteEvent);


 // /events/eventId/helpers/:helperId
router.put('/:eventId/helpers/:helperId', addHelperToEvent);
export default router;
