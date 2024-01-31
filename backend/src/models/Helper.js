import mongoose from "mongoose";
import geocoder from "../utils/geocoder.js";

const helperSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [false, "Please add a description"],
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
    address: {
      type: String,
      required: [false, "Please add an address"],
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
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
    },
  },
  {
    timestamps: true,
  }
);

// Geocode & create location field
helperSchema.pre("save", async function (next) {
  // Check if the address field is present
  if (this.address) {
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

    // Do not save the original address in DB
    this.address = undefined;
  }

  next();
});

// Cascade delete upcomingEvents when a helper is deleted
helperSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`upcomingEvents being removed from helper ${this._id}`);
    await this.model("Event").deleteMany({ helper: this._id });
    next();
  }
);

// Cascade delete feedbacks when a helper is deleted
helperSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`feedbacks being removed from helper ${this._id}`);
    await this.model("Feedback").deleteMany({ helper: this._id });
    next();
  }
);

// Reverse populate with virtual field/attr
helperSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "helper",
  justOne: false,
});

// Reverse populate with virtual field/attr
helperSchema.virtual("feedbacks", {
  ref: "Feedback",
  localField: "_id",
  foreignField: "helper",
  justOne: false, // we want to get a field called "feedbacks" and array of all feedbacks
});

const Helper = mongoose.model("Helper", helperSchema);
export default Helper;
