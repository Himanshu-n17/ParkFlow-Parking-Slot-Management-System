const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CURRENT ACTIVE BOOKING
exports.getCurrentParking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      user: req.params.userId,
      status: "active",
    }).populate("slot");

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER BOOKING HISTORY
exports.getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.params.userId,
    })
      .populate("slot")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AVAILABLE SLOTS
exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({
      status: "free",
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.params.userId,
    });

    const user = await User.findById(req.params.userId);

    const totalBookings = bookings.length;

    const completedBookings = bookings.filter(
      (b) => b.status === "completed",
    ).length;

    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    const activeBooking = bookings.find((b) => b.status === "active");

    let totalSpent = 0;

    bookings.forEach((b) => {
      if (b.status === "completed") {
        totalSpent += b.cost || 0;
      }

      if (b.status === "cancelled") {
        totalSpent += 10; // cancellation charge
      }
    });

    const vehicleNumber =
      user?.vehicleNumber ||
      (bookings.length > 0 ? bookings[0].vehicleNumber : "-");
    res.json({
      totalBookings,
      completedBookings,
      cancelledBookings,
      activeBooking: activeBooking ? true : false,
      totalSpent,
      vehicleNumber,
      wallet: user.wallet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, vehicleNumber, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (vehicleNumber) user.vehicleNumber = vehicleNumber;

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getWalletTransactions = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    const transactions = [];

    bookings.forEach((b) => {
      if (b.status === "completed") {
        transactions.push({
          type: "Parking Payment",
          amount: b.cost,
          status: "debit",
          date: b.updatedAt,
          vehicleNumber: b.vehicleNumber,
        });
      }

      if (b.status === "cancelled") {
        transactions.push({
          type: "Booking Refund",
          amount: b.cost || 0,
          status: "credit",
          date: b.updatedAt,
          vehicleNumber: b.vehicleNumber,
        });

        transactions.push({
          type: "Cancellation Charge",
          amount: 10,
          status: "debit",
          date: b.updatedAt,
          vehicleNumber: b.vehicleNumber,
        });
      }
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
