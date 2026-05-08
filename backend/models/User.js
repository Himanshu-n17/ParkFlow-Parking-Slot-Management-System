const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      // required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    vehicleNumber: {
      type: String,
    },

    wallet: {
      type: Number,
      default: 2000,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
