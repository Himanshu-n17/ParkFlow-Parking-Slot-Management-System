const express = require("express");
const router = express.Router();

const {
  getCurrentParking,
  getBookingHistory,
  getAvailableSlots,
  getUserStats,
  updateProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// current parking
router.get("/current/:userId", protect, getCurrentParking);

// booking history
router.get("/history/:userId", protect, getBookingHistory);

// available slots
router.get("/slots", protect, getAvailableSlots);

// dashboard stats
router.get("/stats/:userId", protect, getUserStats);

router.put("/profile/update", protect, updateProfile);

module.exports = router;
