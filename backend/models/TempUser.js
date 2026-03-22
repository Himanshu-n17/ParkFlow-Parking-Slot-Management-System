const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    phone: String,
    adminKey: String,
    otp: String,
    otpExpiry: Date,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("TempUser", tempUserSchema);
