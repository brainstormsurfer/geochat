import path from "path";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import geocoder from "../utils/geocoder.js";
import Helper from "../models/Helper.js";
// import Event from "../models/Event.js";

import dotenv from "dotenv";
// Load env vars
dotenv.config({ path: "./config/config.env" });

// @desc    Get all helpers
// @route   GET /api/v1/helpers
// @route   GET /api/v1/helpers/:helperId/events
// @access  Public
const getHelpers = asyncHandler(async (req, res, next) => {
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
});

// @desc    Get single helper
// @route   GET /api/v1/helpers/:id
// @access  Private
const getHelper = asyncHandler(async (req, res, next) => {
  const helper = await Helper.findById(req.params.id);

  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: helper });
});


// @desc    Create helper
// @route   POST /api/v1/helpers
// @access  Private/Admin
const createHelper = asyncHandler(async (req, res, next) => {
  // Check if the logged-in user is an admin
  const adminUser = await User.findOne({ _id: req.user.id, role: "admin" });

  if (!adminUser) {
    return next(
      new ErrorResponse(`User with ID ${req.user.id} is not permitted for this task`, 403)
    );
  }

  // Create the Helper
  const helper = await Helper.create({
    id: req.user.id,
    description: "added by admin, please edit..."
  });

  // Update the corresponding user's role to include "helper"
  await User.findByIdAndUpdate(req.user.id, { role: "helper" });

  res.status(201).json({ success: true, data: helper });
});


// @desc    Update helper
// @route   PUT /api/v1/helpers/:id
// @access  Private
const updateHelper = asyncHandler(async (req, res, next) => {
  // let helper = await Helper.findById(req.params.id);
  let helper = await Helper.findOne({ id: req.user.id });


  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure editor is the helper
  if (Helper.id.toString() !== req.user.id || req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this helper`,
        401
      )
    );
  }

  helper = await Helper.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: helper });
});

// @desc    Delete helper
// @route   DELETE /api/v1/helpers/:id
// @access  Private
const deleteHelper = asyncHandler(async (req, res, next) => {
  // const helper = await Helper.findById(req.params.id);
  const helper = await Helper.findOne({ id: req.user.id });


  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure editted user is the helper
  if (Helper.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this helper`,
        401
      )
    );
  }

  await Helper.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get helpers within a radius
// @route   GET /api/v1/helpers/radius/:zipcode/:distance
// @access  Private
const getHelpersInRadius = asyncHandler(async (req, res, next) => {
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
});

// @desc    Upload photo helper
// @route   PUT /api/v1/helpers/:id/photo
// @access  Private
const helperPhotoUpload = asyncHandler(async (req, res, next) => {
  const helper = await Helper.findById(req.params.id);
  if (!helper) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(`helper not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure editted user is the helper
  if (Helper.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this helper`,
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
  file.name = `photo_${Helper._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await Helper.findByIdAndUpdate(req.params.id, { photo: file.name });
  });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});

export {
  getHelpers,
  getHelper,
  createHelper,
  updateHelper,
  deleteHelper,
  getHelpersInRadius,
  helperPhotoUpload,
};
