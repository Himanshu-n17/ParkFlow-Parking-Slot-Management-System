const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const User = require("../models/User");
const AdminStats = require("../models/AdminStats");

// VEHICLE ENTRY (Manual or Camera)
exports.vehicleEntry = async (req, res) => {
  try {
    const { slotId, vehicleNumber, userId, bookingType } = req.body;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    if (slot.status !== "free") {
      return res.status(400).json({
        message: "Slot not available",
      });
    }

    const activeBooking = await Booking.findOne({
      vehicleNumber,
      status: "active",
    });

    if (activeBooking) {
      return res.status(400).json({
        message: "Vehicle already parked",
      });
    }

    const booking = await Booking.create({
      user: userId,
      slot: slotId,
      vehicleNumber,
      bookingType,
    });

    slot.status = "occupied";
    slot.currentVehicle = vehicleNumber;

    await slot.save();

    res.json({
      message: "Vehicle entry recorded",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VEHICLE EXIT
exports.vehicleExit = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    const booking = await Booking.findOne({
      vehicleNumber,
      status: "active",
    });

    if (!booking) {
      return res.status(404).json({
        message: "Active booking not found",
      });
    }

    booking.exitTime = new Date();

    const duration = (booking.exitTime - booking.entryTime) / (1000 * 60 * 60);

    booking.duration = duration;

    const ratePerHour = 20;

    booking.cost = Math.ceil(duration * ratePerHour);

    booking.status = "completed";

    booking.paymentStatus = "paid";

    await booking.save();

    const slot = await Slot.findById(booking.slot);

    slot.status = "free";
    slot.currentVehicle = null;

    await slot.save();

    res.json({
      message: "Vehicle exit recorded",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER BOOKING HISTORY
exports.getUserBookings = async (req, res) => {
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

// ADMIN VIEW ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("slot")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "active") {
      return res.status(400).json({
        message: "Booking cannot be cancelled",
      });
    }

    const slot = await Slot.findById(booking.slot);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    if (slot.status !== "booked") {
      return res.status(400).json({
        message: "Cancellation allowed only before vehicle arrival",
      });
    }

    const user = await User.findById(booking.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const cancellationFee = 10;

    const refundAmount = booking.cost - cancellationFee;

    if (refundAmount > 0) {
      user.wallet += refundAmount;
      await user.save();
    }

    const stats = await AdminStats.findOne();
    stats.totalRevenue -= booking.cost;
    stats.totalRevenue += cancellationFee;
    await stats.save();

    booking.status = "cancelled";
    await booking.save();

    slot.status = "free";
    slot.currentVehicle = null;
    await slot.save();

    res.json({
      message: "Booking cancelled successfully",
      cancellationFee,
      refundedAmount: refundAmount,
      updatedWalletBalance: user.wallet,
      booking,
      slot,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
