const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
    },

    vehicleNumber: {
      type: String,
      required: true,
    },

    bookingType: {
      type: String,
      enum: ["manual", "camera"],
      default: "manual",
    },

    entryTime: {
      type: Date,
      default: Date.now,
    },

    exitTime: {
      type: Date,
    },

    duration: {
      type: Number,
    },

    cost: {
      type: Number,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
