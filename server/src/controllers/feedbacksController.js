import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Feedback from "../models/Feedback.js";
import Helper from "../models/Helper.js";

// @desc    Get all feedbacks
// @route   GET /api/v1/feedbacks
// @route   GET /api/v1/helpers/:helperId/feedbacks
// @access  Public
const getFeedbacks = asyncHandler(async (req, res, next) => {
  if (req.params.helperId) {
    const feedbacks = await Feedback.find({ helper: req.params.helperId });

    // getting feedbacks for a specific helper (not using advanced results)
    // via helper's reverse populate with virtuals,
    // And via the {mergeParams: true} feedbacksRouter property
    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single feedback
// @route   GET /api/v1/feedbacks/:id
// @access  Public
const getFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findById(req.params.id).populate({
    path: "helper",
    select: "username",
  });

  if (!feedback) {
    return next(
      // if it is formatted object id but not in db
      new ErrorResponse(
        `No feedback found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: feedback });
});

// (preparation: Event is/as  helper's virtual field/attribute)
// @desc    Add feedback
// @route   POST /api/v1/helpers/:helperId/feedbacks
// @access  Private
const addFeedback = asyncHandler(async (req, res, next) => {
  req.body.helper = req.params.helperId;
  req.body.user = req.user.id;

  const helper = await Helper.findById(req.params.helperId);

  if (!helper) {
    return next(
      new ErrorResponse(`No helper with the id of ${req.params.helperId}`),
      404
    );
  }

  const feedback = await Feedback.create(req.body);
  res.status(201).json({ success: true, data: feedback });
});

// @desc    Update feedback
// @route   PUT /api/v1/feedbacks/:id
// @access  Private
const updateFeedback = asyncHandler(async (req, res, next) => {
  let feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return next(
      new ErrorResponse(`No feedback with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is feedback provider
  // if (Feedback.user.toString() !== req.user.id || req.user.role === "publisher") {
  if (Feedback.user.toString() !== req.user.id && req.user.role == !"admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to update feedback ${Feedback._id}`
      ),
      401
    );
  }

  feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await Feedback.save(); // triggers the post middleware
  res.status(201).json({ success: true, data: feedback });
});

// @desc    Delete feedback
// @route   DELETE /api/v1/feedbacks/:id
// @access  Private
const deleteFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return next(
      new ErrorResponse(`No feedback with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is feedback owner
  // if (Feedback.user.toString() !== req.user.id || req.user.role === "publisher") {
  if (Feedback.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorize to delete feedback ${Feedback._id}`
      ),
      404
    );
  }

  await Feedback.deleteOne();
  res.status(201).json({ success: true, data: {} });
});

export {
  getFeedbacks,
  getFeedback,
  addFeedback,
  updateFeedback,
  deleteFeedback,
};
