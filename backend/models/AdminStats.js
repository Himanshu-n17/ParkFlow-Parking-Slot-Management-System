const mongoose = require("mongoose");

const adminStatsSchema = new mongoose.Schema({
  totalRevenue: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("AdminStats", adminStatsSchema);
