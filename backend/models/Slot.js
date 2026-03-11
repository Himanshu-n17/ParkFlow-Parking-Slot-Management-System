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

    status: {
      type: String,
      enum: ["free", "booked", "occupied"],
      default: "free",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Slot", slotSchema);
