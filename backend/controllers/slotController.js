const Slot = require("../models/Slot");

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

    const slot = await Slot.findOneAndUpdate(
      { sensorId },
      { status },
      { new: true },
    );

    res.json({
      message: "Slot updated by sensor",
      slot,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
