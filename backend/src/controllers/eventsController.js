import ErrorResponse from "../utils/errorResponse.js";
import Event from "../models/Event.js";
import Helper from "../models/Helper.js";
import User from "../models/User.js";

// @desc    Get all events
// @route   GET /events
// @route   GET /helpers/:helperId/events
// @access  Public
const getEvents = async (req, res, next) => {
  console.log("GET EVENTS")
  // const events = await Event.find({ helpers: { $in: [req.params.helperId] } });
  
  // if (req.params.helperId) {
  const events = await Event.find(
    // { helper: req.params.helperId }
    );

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  // } else {
    // getting all events
    res.status(200).json(res.advancedResults);
  // }
};

// @desc    Get single event
// @route   GET /events/:id
// @access  Public
const getEvent = async (req, res, next) => {

  console.log("GET EVENT")
  // const event = await Event.findById(req.params.id).populate({
  //   path: "helper",
  //   select: "username location isAvailable",
  // });
  // const event = await Event.findById(req.params.id).populate("helpers");
  const event = await Event.findById(req.params.id).populate({
    path: 'helpers',
    select: 'id', // Adjust the fields you want to select from the Helper model
  }).exec();

  if (!event) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`No event with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: event });
};


// @desc    Add helper to an event
// @route   PUT /events/:eventId/helper/:helperId
// @access  Public

// Add a helper to an existing event
const addHelperToEvent = async (req, res, next) => {

  console.log("ADD HELPER TO EVENT")
  try {
    const eventId = req.params.eventId;
    const helperId = req.params.helperId;


    // Check if both the event and helper exist
    const event = await Event.findById(eventId);
    const helper = await Helper.findById(helperId);

    if (!event || !helper) {
      return res.status(404).json({ success: false, message: 'Event or helper not found' });
    }

    if (event.helpers.includes(helperId))
    {      
    return res.status(200).json({ success: true, message: 'Helper is already registered to this event'});
    }

    // Update the event's helpers array
    event.helpers.push(helper);
    await event.save();

 // Retrieve the populated event with detailed helper information
 // (currently populate with helper's id)
 const populatedEvent = await Event.findById(eventId).populate('helpersData').exec();

    res.status(201).json({ success: true, message: 'Helper added to event successfully', event: populatedEvent });

  // Update the helper's events array
    // helper.events.push(event);

    // await helper.save();
    
    // const fetchedEvent = await Event.findById(eventId).populate('helpers').exec();

    // res.status(200).json({ success: true, message: 'Helper added to event successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Add an event
// @route   POST /helpers/:helperId/events
// @access  Private
const addEvent = async (req, res, next) => {
  console.log("ADD EVENT, req.username = username:", req.username);
  req.body.helper = req.params.helperId;
  // req.body.user = req.username;

  const user = await User.findOne({ username: req.username });
  // Make sure the user is the respective helper or an admin
  if (!user.roles.includes('helper') && !user.roles.includes('admin')) {
    return next(new ErrorResponse('Adding an event to a helper is allowed only by admin or the respective helper', 401));
  }

  const helper = await Helper.findOne({ _id: req.params.helperId });
  if (!helper) {
    return next(new ErrorResponse(`No valid helper with the id of ${req.params.helperId}`, 404));
  }

  
  // Create the event
  let event = await Event.create(req.body);

  // Update the helper field with the Helper model reference
  event.helper = helper._id;
  await event.save();

  // Now populate the helper field for a complete response
  event = await Event.findById(event._id).populate({
    path: 'helpers',
    select: 'description', // Adjust the fields you want to select from the Helper model
  }).exec();

  res.status(200).json({
    success: true,
    data: event,
  });
};


// @desc    Update event
// @route   PUT /events/:id
// @access  Private
const updateEvent = async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`No event with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is event owner
  if (Event.user.toString() !== req.username.id && req.username.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.username.id} is not authorize to update event ${Event._id}`
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
};

// @desc    Delete event
// @route   DELETE /events/:id
// @access  Private
const deleteEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`No event with the id of ${req.params.id}`, 404),
      404
    );
  }

  // Authorization check
  if (Event.user.toString() !== req.username.id && req.username.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.username.id} is not authorized to delete event ${Event._id}`,
        404
      ),
      404
    );
  }

  // Delete the event
  await Event.deleteOne();

  res.status(201).json({ success: true, data: {} });
};

export { getEvents, getEvent, addEvent, addHelperToEvent, updateEvent, deleteEvent };
