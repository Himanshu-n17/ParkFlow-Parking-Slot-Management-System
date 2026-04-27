const User = require("../models/User");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");

// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalSlots = await Slot.countDocuments();

    const freeSlots = await Slot.countDocuments({ status: "free" });

    const bookedSlots = await Slot.countDocuments({ status: "booked" });

    const occupiedSlots = await Slot.countDocuments({
      status: "occupied",
    });

    const activeBookings = await Booking.countDocuments({
      status: "active",
    });

    const completedBookings = await Booking.find({
      status: "completed",
    });

    const totalRevenue = completedBookings.reduce(
      (sum, b) => sum + (b.cost || 0),
      0,
    );

    res.json({
      totalUsers,
      totalSlots,
      freeSlots,
      bookedSlots,
      occupiedSlots,
      activeBookings,
      completedBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RECENT BOOKINGS
exports.getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("slot", "slotNumber floor sector")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SLOT OCCUPANCY
exports.getSlotStats = async (req, res) => {
  try {
    const free = await Slot.countDocuments({ status: "free" });
    const occupied = await Slot.countDocuments({ status: "occupied" });
    const booked = await Slot.countDocuments({ status: "booked" });

    res.json({
      free,
      occupied,
      booked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlertSlots = async (req, res) => {
  try {
    const alertSlots = await Slot.find({
      status: "alert",
    });

    res.json({
      alerts: alertSlots,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REVENUE ANALYTICS
exports.getRevenueStats = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: "completed",
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.cost || 0), 0);

    const totalBookings = bookings.length;

    const avgRevenue = totalBookings === 0 ? 0 : totalRevenue / totalBookings;

    res.json({
      totalRevenue,
      totalBookings,
      avgRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
