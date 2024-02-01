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
    },
    refreshToken: [String],
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

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();  // 1st 'next' in case user is not new, i guess
  }
  bcrypt.genSalt(6, (err, salt) => {
    if (err) {
      return next(err);   // 2nd 'next' in case of error in genSalt
    }
    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) {
        return next(error);  // 3rd 'next' in case of error in hash
      }
      user.password = hash;
      next(); // 4th 'next' in case of genSalt success
    });
    next();
  });
});

// UserSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const user = this;
//     bcrypt.hash(user.password, 6, function (err, hash) {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     });
//   } else {
//     next();
//   }
// });

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

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(6);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
