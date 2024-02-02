import path from "path";
import ErrorResponse from "../utils/errorResponse.js";

import geocoder from "../utils/geocoder.js";
import Helper from "../models/Helper.js";
// import Event from "../models/Event.js";

import dotenv from "dotenv";
// Load env vars
dotenv.config({ path: "./config/config.env" });

// @desc    Get all helpers
// @route   GET /helpers
// @route   GET /helpers/:helperId/events
// @access  Public
const getHelpers = async (req, res, next) => {
  if (req.params.eventId) {
    const helpers = await Helper.find({ event: req.params.eventId });

    // getting helpers for a specific event (not using advanced results)
    // via Event's reverse populate with virtuals,
    // And via the {mergeParams: true} eventsRouter property
    return res.status(200).json({
      success: true,
      count: helpers.length,
      data: helpers,
    });
  } else {
    // getting all helpers
    res.status(200).json(res.advancedResults);
    // now when we get all helpers we can implement pagination and all the advanced commands
  }
};

// @desc    Get single helper
// @route   GET /helpers/:id
// @access  Private
const getHelper = async (req, res, next) => {
  const helperId = await Helper.findById(req.params.id);
  const helper = await Helper.findById(helperId).populate("events");

  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: helper });
};


// @desc    Create helper
// @route   POST /helpers
// @access  Private/Admin
const createHelper = async (req, res, next) => {
  // Check if the logged-in user is an admin
  const adminUser = await User.findOne({ _id: req.username.id, role: "admin" });

  if (!adminUser) {
    return next(
      new ErrorResponse(`User with ID ${req.username.id} is not permitted for this task`, 403)
    );
  }

  // Create the Helper
  const helper = await Helper.create({
    id: req.username.id,
    description: "added by admin, please edit..."
  });

  // Update the corresponding user's role to include "helper"
  await User.findByIdAndUpdate(req.username.id, { role: "helper" });

  res.status(201).json({ success: true, data: helper });
};
// @desc    Update helper
// @route   PUT /helpers/:helperId/event/:eventId
// @access  Private
// Add an event to a helper
const addEventToHelper = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const helperId = req.params.helperId;

    // Check if both the event and helper exist
    const event = await Event.findById(eventId);
    const helper = await Helper.findById(helperId);

    if (!event || !helper) {
      return res.status(404).json({ success: false, message: 'Event or helper not found' });
    }

    // Update the helper's events array
    helper.events.push(event);
    await helper.save();

    // Update the event's helpers array
    event.helpers.push(helper);
    await event.save();

    res.status(200).json({ success: true, message: 'Event added to helper successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// @desc    Update helper
// @route   PUT /helpers/:id
// @access  Private
const updateHelper = async (req, res, next) => {
  // let helper = await Helper.findById(req.params.id);
  let helper = await Helper.findOne({ id: req.username.id });


  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure editor is the helper
  if (Helper.id.toString() !== req.username.id || req.username.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.username.id} is not authorized to update this helper`,
        401
      )
    );
  }

  helper = await Helper.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: helper });
};

// @desc    Delete helper
// @route   DELETE /helpers/:id
// @access  Private
const deleteHelper = async (req, res, next) => {
  // const helper = await Helper.findById(req.params.id);
  const helper = await Helper.findOne({ id: req.username.id });


  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure editted user is the helper
  if (Helper.id.toString() !== req.username.id && req.username.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.username.id} is not authorized to update this helper`,
        401
      )
    );
  }

  await Helper.deleteOne();
  res.status(200).json({ success: true, data: {} });
};

// @desc    Get helpers within a radius
// @route   GET /helpers/radius/:zipcode/:distance
// @access  Private
const getHelpersInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians (a unit to measure spheres)
  // Divide dist by radius of Earth
  // Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 6378.1;

  const helpers = await Helper.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: helpers.length,
    data: helpers,
  });
};

// @desc    Upload photo helper
// @route   PUT /helpers/:id/photo
// @access  Private
const helperPhotoUpload = async (req, res, next) => {
  const helper = await Helper.findById(req.params.id);
  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure editted user is the helper
  if (Helper.id.toString() !== req.username.id && req.username.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.username.id} is not authorized to update this helper`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    // mimetype: 'image/jpeg',
    return next(new ErrorResponse("Please update an image file", 400));
  }

  // Check (/Limit) file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom file name
  file.username = `photo_${Helper._id}${path.parse(file.username).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.username}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await Helper.findByIdAndUpdate(req.params.id, { photo: file.username });
  });

  res.status(200).json({
    success: true,
    data: file.username,
  });
};

export {
  getHelpers,
  getHelper,
  createHelper,
  addEventToHelper,
  updateHelper,
  deleteHelper,
  getHelpersInRadius,
  helperPhotoUpload,
};
