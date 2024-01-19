import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Course from "../models/Event.js";
import helper from "../models/Helper.js";

// @desc    Get all events
// @route   GET /api/v1/events
// @route   GET /api/v1/helpers/:helperId/events
// @access  Public
const getEvents = asyncHandler(async (req, res, next) => {
  if (req.params.helperId) {
    const events = await Event.find({ helper: req.params.helperId });

    // getting events for a specific helper (not using advanced results)
    // via helper's reverse populate with virtuals,
    // And via the {mergeParams: true} eventsRouter property
    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } else {
    // getting all events
    res.status(200).json(res.advancedResults);
    // now when we get all events we can implement pagination and all the advanced commands
  }
});

// @desc    Get single course
// @route   GET /api/v1/events/:id
// @access  Public
const getEvent = asyncHandler(async (req, res, next) => {
  const course = await Event.findById(req.params.id).populate({
    path: "helper",
    select: "username location isAvailable",
  });

  if (!course) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});

// (preparation: Course is/as  helper's virtual field/attribute)
// @desc    Add course
// @route   POST /api/v1/helpers/:helperId/events
// @access  Private
const addEvent = asyncHandler(async (req, res, next) => {
  req.body.helper = req.params.helperId;
  req.body.user = req.user.id;

  const helper = await Helper.findById(req.params.helperId);

  if (!helper) {
    return next(
      new ErrorResponse(`No helper with the id of ${req.params.helperId}`),
      404
    );
  }

  // Make sure user is helper owner
  if (Helper.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to add a course to helper ${Helper._id}`
      ),
      401
    );
  }
  const course = await Event.create(req.body);

  res.status(201).json({ success: true, data: course });
});

// @desc    Update course
// @route   PUT /api/v1/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res, next) => {
  let course = await Event.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is helper owner
  if (Event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to update course ${Event._id}`
      ),
      401
    );
  }

  course = await Event.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    //options
    new: true,
    runValidators: true,
  });

  await Event.save();
  res.status(201).json({ success: true, data: course });
});

// @desc    Delete course
// @route   DELETE /api/v1/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res, next) => {
  const course = await Event.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404),
      404
    );
  }

  // Authorization check
  if (Event.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${Event._id}`,
        404
      ),
      404
    );
  }

  // Update average cost before deletion
  // try {
  //   await Event.constructor.getAverageCost(Event.helper);
  // } catch (err) {
  //   console.error("Error updating average cost:", err);
  // }

  // Delete the course
  await Event.deleteOne();

  res.status(201).json({ success: true, data: {} });
});

export { getEvents, getEvent, addEvent, updateEvent, deleteEvent };
