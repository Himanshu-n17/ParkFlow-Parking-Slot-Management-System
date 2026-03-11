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
    },

    entryTime: {
      type: Date,
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

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
