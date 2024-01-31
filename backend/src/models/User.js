import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
      username: {
          type: String,
          required: [true, 'Please enter username.']
      },
      email: {
          type: String,
          required: true,
          unique: true,          
          validate: [validator.isEmail, 'Please enter a valid email. or...']
      },
    roles: {
      type: [String],
      default: ["user"],
      enum: ["user", "publisher", "helper", "guest", "admin"],
  },
    // role: {
    //   type: String,
    //   enum: ["user", "publisher", "helper", "guest", "admin"],
    //   default: "user",
    // },
    // roles: {
    //     User: {
    //         type: Number,
    //         default: 2001
    //     },
    //     Guest: Number,
    //     Editor: Number,
    //     Admin: Number
    // },
    refreshToken: [String],
  },
  {
    timestamps: true,
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
  }
);

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
UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && !this.isNew) {
    // Hash the password only if it's modified and the document is not new
    const salt = await bcrypt.genSalt(6);
    this.password = await bcrypt.hash(this.password, salt);
  } else 
  next();
});





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