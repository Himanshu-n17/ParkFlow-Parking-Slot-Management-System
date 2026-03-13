const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

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
