const mongoose = require("mongoose");

const anprDetectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plate: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    source: {
      type: String,
      default: "webcam",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AnprDetection", anprDetectionSchema);
