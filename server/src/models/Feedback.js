import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the feedbacks"],
    maxLength: 100,
  },
  text: {
    type: String,
    required: [false, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  helper: {
    type: mongoose.Schema.ObjectId,
    ref: "Helper",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false, //?
  },
},
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
    toObject: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    }
  });

// Prevent user from submitting more than one feedbacks per helper
FeedbackSchema.index({ helper: 1, user: 1 }, { unique: true });

// Static method to get avg of feedbacks ratings
FeedbackSchema.statics.getAverageRating = async function (
  helperId,
  deletedFeedback
) {
  const obj = await this.aggregate([
    {
      $match: { helper: helperId },
    },
    {
      $group: {
        _id: "$helper",
        averageRating: { $avg: "$rating" },
        feedbacks: { $push: "$_id" }, // Push the document IDs into an array
      },
    },
  ]);

  if (obj.length > 0) {
    // If the deletedFeedback is provided, subtract it from the aggregate
    if (deletedFeedback) {
      const updatedTotalRating =
        obj[0].averageRating * obj[0].feedbacks.length - deletedFeedback;
      const updatedAverageRating =
        obj[0].feedbacks.length > 1
          ? updatedTotalRating / (obj[0].feedbacks.length - 1)
          : 0;
      obj[0].averageRating = updatedAverageRating;
    }

    try {
      await this.model("Helper").findByIdAndUpdate(helperId, {
        averageRating: obj[0].averageRating,
      });
    } catch (err) {
      console.error(err);
    }
  }
};

// Call getAverage after save
FeedbackSchema.post("save", function () {
  this.constructor.getAverageRating(this.helper);
});

// Call getAverageRating before deleting the feedbacks (with its rating value)
FeedbackSchema.pre("deleteOne", { document: true }, async function () {
  await this.constructor.getAverageRating(this.helper, this.rating);
});

export default mongoose.model("Feedback", FeedbackSchema);
