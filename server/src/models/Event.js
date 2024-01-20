import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a event title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, "Please add an expected date"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expectedPresence: {
    type: Number,
    default: 0,
  },
  potentialExplorers: {
    type: Number,
    default: 0,
  },
  isAtNature: {
    type: Boolean
  },
  helper: {
    type: mongoose.Schema.ObjectId,
    ref: "Helper",
    required: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Event", EventSchema);
