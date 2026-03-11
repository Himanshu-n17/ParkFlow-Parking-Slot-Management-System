const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    amount: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
