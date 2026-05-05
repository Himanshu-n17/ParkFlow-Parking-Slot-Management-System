const express = require("express");
const router = express.Router();

const {
  createSlot,
  getSlots,
  updateSlotStatus,
  deleteSlot,
  sensorUpdateSlot,
  bookSlot,
} = require("../controllers/slotController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// admin create slot
router.post("/", protect, adminOnly, createSlot);

// get all slots
router.get("/", getSlots);

router.post("/book-slot", bookSlot);

// admin update
router.put("/:id", protect, updateSlotStatus);

// delete slot
router.delete("/:id", protect, adminOnly, deleteSlot);

// sensor update slot
router.post("/sensor-update", sensorUpdateSlot);

module.exports = router;
