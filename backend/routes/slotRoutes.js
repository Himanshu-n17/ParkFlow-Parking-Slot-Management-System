const express = require("express");
const router = express.Router();

const {
  createSlot,
  getSlots,
  updateSlotStatus,
  deleteSlot,
  sensorUpdateSlot,
} = require("../controllers/slotController");

const { protect } = require("../middleware/authMiddleware");

// admin create slot
router.post("/", protect, createSlot);

// get all slots
router.get("/", getSlots);

// admin update
router.put("/:id", protect, updateSlotStatus);

// delete slot
router.delete("/:id", protect, deleteSlot);

// sensor update slot
router.post("/sensor-update", sensorUpdateSlot);

module.exports = router;
