import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Event from "../models/Event.js";
import Helper from "../models/Helper.js";

// @desc    Get all events
// @route   GET /api/v1/events
// @route   GET /api/v1/helpers/:helperId/events
// @access  Public
const getEvents = asyncHandler(async (req, res, next) => {
  if (req.params.helperId) {
    const events = await Event.find({ helper: { $in: [req.params.helperId] } });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } else {
    // getting all events
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single event
// @route   GET /api/v1/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate({
    path: "helper",
    select: "username location isAvailable",
  });

  if (!event) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`No event with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: event });
});

// (this route is for creating a new event by admin or user with a publisher permission)
// @desc    Add an event
// @route   POST /api/v1/helpers/:helperId/events
// @access  Private
const addEvent  = asyncHandler(async (req, res, next) => {
  req.body.helper = req.params.helperId;
  req.body.user = req.user.id;

  const helper = await Helper.findOne({ _id: req.user.id });

  if (!helper) {
    return next(new ErrorResponse(`No valid helper with the id of ${req.params.helperId}`, 404));
  }

  // Make sure the user is the respective helper or an admin
  if (req.user.role !== 'helper' && req.user.role !== 'admin') {
    return next(new ErrorResponse('Adding an event to a helper is allowed only by admin or the respective helper', 401));
  }

  // Create the event
  let event = await Event.create(req.body)

  event = Event.findById(event._id).populate({
    path: 'helper', 
    select: 'title', 
  }).exec();

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`No event with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is event owner
  if (Event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to update event ${Event._id}`
      ),
      401
    );
  }

  event = await Event.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    //options
    new: true,
    runValidators: true,
  });

  await Event.save();
  res.status(201).json({ success: true, data: event });
});

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`No event with the id of ${req.params.id}`, 404),
      404
    );
  }

  // Authorization check
  if (Event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete event ${Event._id}`,
        404
      ),
      404
    );
  }

  // Delete the event
  await Event.deleteOne();

  res.status(201).json({ success: true, data: {} });
});

export { getEvents, getEvent, addEvent, updateEvent, deleteEvent };
