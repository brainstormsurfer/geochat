import mongoose from "mongoose";
import slugify from "slugify";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
    trim: true,
    maxlength: [50, "Title can not be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
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
  countdown: {
    type: Number,
    virtual: true,
    get: function () {
      return differenceInDays(this.date, new Date());
    },
  },
  user: [{
    type: mongoose.Schema.ObjectId,
    ref: "Helper",
    foreignField: "events",
    required: false,
  }],
  helper: {
    type: mongoose.Schema.ObjectId,
    ref: "Helper",
    required: false,
  },
  // helpers: [{
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Helper",
  //   required: false,
  // }],
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


// Create event slug from the name
EventSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});


// EventSchema.virtual("helpers", {
//   ref: "Helper",
//   foreignField: "_id",
//   localField: "event",
//   justOne: false,
// });

export default mongoose.model("Event", EventSchema);
