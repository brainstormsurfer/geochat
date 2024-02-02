import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ["user"],
      enum: ["user", "publisher", "helper", "guest", "admin"],
    }    
  },
  {
    timestamps: true,
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.password;
        // delete ret.__v;
      },
    },
    toObject: {
      transform(_, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.password;
        // delete ret.__v;
      },
    },
  }
);

UserSchema.pre("save", async function (next) {
  console.log("PRE SAVE PASSWORD CHECK (USER SCHEMA)");

  try {
    if (this.isModified("password") || (!this.password.startsWith("$2") && !this.password.startsWith("$argon2"))) {
      const user = this;
      const salt = await bcrypt.genSalt(6);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    }
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;