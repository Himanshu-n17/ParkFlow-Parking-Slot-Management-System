const Slot = require("../models/Slot");
const Booking = require("../models/Booking");

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
    const { slotId, userId, vehicleNumber } = req.body;

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

    const booking = await Booking.create({
      user: userId,
      slot: slotId,
      vehicleNumber,
      bookingType: "manual",
      paymentStatus: "paid",
    });

    slot.status = "booked";

    await slot.save();

    res.json({
      message: "Slot booked successfully",
      booking,
      slot,
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
