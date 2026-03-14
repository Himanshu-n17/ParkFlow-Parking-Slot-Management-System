const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getRecentBookings,
  getSlotStats,
  getRevenueStats,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

// dashboard summary
router.get("/stats", protect, getDashboardStats);

// recent bookings
router.get("/recent-bookings", protect, getRecentBookings);

// slot stats
router.get("/slot-stats", protect, getSlotStats);

// revenue analytics
router.get("/revenue", protect, getRevenueStats);

module.exports = router;
