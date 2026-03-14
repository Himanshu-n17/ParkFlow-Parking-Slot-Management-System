const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

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

// USER DASHBOARD STATS
exports.getUserStats = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.params.userId,
    });

    const totalBookings = bookings.length;

    const totalSpent = bookings.reduce((sum, b) => sum + (b.cost || 0), 0);

    const activeBooking = bookings.find((b) => b.status === "active");

    res.json({
      totalBookings,
      totalSpent,
      activeBooking: activeBooking ? true : false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
