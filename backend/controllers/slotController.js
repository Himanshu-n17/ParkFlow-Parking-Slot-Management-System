const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const User = require("../models/User");
const AdminStats = require("../models/AdminStats");

// Parking pricing logic
const calculateCost = (seconds) => {
  const minutes = seconds / 60;
  const hours = seconds / 3600;

  if (minutes <= 30) return 20;
  if (hours <= 1) return 30;
  if (hours <= 2) return 50;
  if (hours <= 3) return 80;
  if (hours <= 5) return 150;
  if (5 < hours && hours <= 8) return 200;

  return 250;
};
// CREATE SLOT (Admin)
exports.createSlot = async (req, res) => {
  try {
    const { slotNumber, floor, sector, sensorId } = req.body;

    const slot = await Slot.create({
      slotNumber,
      floor,
      sector,
      sensorId,
    });

    res.status(201).json({
      message: "Slot created successfully",
      slot,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL SLOTS (Find Parking Page)
exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.find();

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { slotId, userId, vehicleNumber, duration } = req.body;

    if (!duration || !/^\d{2}:\d{2}:\d{2}$/.test(duration)) {
      return res.status(400).json({
        message: "Duration must be in HH:MM:SS format",
      });
    }

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    if (slot.status !== "free") {
      return res.status(400).json({
        message: "Slot already booked or occupied",
      });
    }

    const existingBooking = await Booking.findOne({
      user: userId,
      status: "active",
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "User already has active booking",
      });
    }
    const convertDurationToSeconds = (time) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);

      return hours * 3600 + minutes * 60 + seconds;
    };

    const durationInSeconds = convertDurationToSeconds(duration);

    const cost = calculateCost(durationInSeconds);

    const user = await User.findById(userId);

    if (durationInSeconds < 600) {
      return res.status(400).json({
        message: "Minimum booking duration is 10 minutes",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.wallet < cost) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    // ✅ Deduct wallet balance
    user.wallet -= cost;
    await user.save();

    let stats = await AdminStats.findOne();
    if (!stats) {
      stats = await AdminStats.create({ totalRevenue: 0 });
    }
    stats.totalRevenue += cost;
    await stats.save();

    const entryTime = new Date();

    const exitTime = new Date(entryTime.getTime() + durationInSeconds * 1000);

    const booking = await Booking.create({
      user: userId,
      slot: slotId,
      vehicleNumber,
      bookingType: "manual",
      duration: durationInSeconds,
      entryTime,
      exitTime,
      cost,
      paymentStatus: "paid",
    });

    slot.status = "booked";

    await slot.save();

    res.json({
      message: "Slot booked successfully",
      booking,
      slot,
      remainingWalletBalance: user.wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE SLOT STATUS (Admin manual update)
exports.updateSlotStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json({
      message: "Slot updated",
      slot,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SENSOR UPDATE SLOT (Hardware API)
exports.sensorUpdateSlot = async (req, res) => {
  try {
    const { sensorId, status } = req.body;

    const slot = await Slot.findOne({ sensorId });

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    if (status === "occupied") {
      const activeBooking = await Booking.findOne({
        slot: slot._id,
        status: "active",
      });

      // If no booking exists → mark alert
      if (!activeBooking) {
        slot.status = "alert";

        await slot.save();

        return res.json({
          message: "Unauthorized parking detected",
          slot,
        });
      }
    }

    if (slot.status === "booked" && status !== "occupied") {
      return res.json({
        message: "Slot reserved. Ignoring sensor update.",
        slot,
      });
    }

    if (slot.status === "alert" && status === "free") {
      slot.status = "free";

      await slot.save();

      return res.json({
        message: "Alert cleared. Slot is now free.",
        slot,
      });
    }

    // Update slot normally
    slot.status = status;

    if (status === "free") {
      slot.currentVehicle = null;
    }

    await slot.save();

    // Complete booking when vehicle leaves
    if (status === "free") {
      const booking = await Booking.findOneAndUpdate(
        {
          slot: slot._id,
          status: "active",
        },
        {
          status: "completed",
          exitTime: new Date(),
        },
        { new: true },
      );

      console.log("Completed booking:", booking);
    }

    res.json({
      message: "Slot updated by sensor",
      slot,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE SLOT
exports.deleteSlot = async (req, res) => {
  try {
    await Slot.findByIdAndDelete(req.params.id);

    res.json({
      message: "Slot deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
