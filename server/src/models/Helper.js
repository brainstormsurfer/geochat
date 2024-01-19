import mongoose from "mongoose";
import slugify from "slugify";
import geocoder from "../utils/geocoder.js";

const HelperSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
      maxlength: [50, "username can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        enum: ["Point"],
        // required: true
        required: false,
      },
      coordinates: {
        type: [Number],
        // required: true,
        required: false,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    mobility: {
      type: Boolean,
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    upcomingEvents: {
      type: [{ type: String }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create helper slug from the username
HelperSchema.pre("save", function (next) {
  this.slug = slugify(this.username, { lower: true });
  next();
});

// Geocode & create location field
HelperSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetusername,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  this.address = undefined;

  next();
});

// Cascade delete events when a helper is deleted
HelperSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`events being removed from helper ${this._id}`);
    await this.model("Course").deleteMany({ helper: this._id });
    next();
  }
);

// Cascade delete feedbacks when a helper is deleted
HelperSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`feedbacks being removed from helper ${this._id}`);
    await this.model("Feedback").deleteMany({ helper: this._id });
    next();
  }
);

// Reverse populate with virtual field/attr
HelperSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "helper",
  justOne: false, // we want to get a field called "events" and array of all events
});

// Reverse populate with virtual field/attr
HelperSchema.virtual("feedbacks", {
  ref: "Feedback",
  localField: "_id",
  foreignField: "helper",
  justOne: false, // we want to get a field called "feedbacks" and array of all feedbacks
});

export default mongoose.model("Helper", HelperSchema);

/* 
<< hides id from fronend >>
   transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
*/
