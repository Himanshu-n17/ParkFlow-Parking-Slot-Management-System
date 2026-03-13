const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: true,
    },

    floor: {
      type: String,
    },

    sector: {
      type: String,
    },

    sensorId: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: ["free", "booked", "occupied"],
      default: "free",
    },

    currentVehicle: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Slot", slotSchema);
