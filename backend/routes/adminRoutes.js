const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getRecentBookings,
  getSlotStats,
  getRevenueStats,
  getAlertSlots,
  getWeeklyRevenue,
  getPeakHours,
  getUtilization,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

// dashboard summary
router.get("/stats", protect, getDashboardStats);

// recent bookings
router.get("/recent-bookings", protect, getRecentBookings);

// revenue analytics
router.get("/revenue", protect, getRevenueStats);

router.get("/alerts", protect, getAlertSlots);

router.get("/revenue-weekly", protect, getWeeklyRevenue);

router.get("/peak-hours", protect, getPeakHours);

router.get("/utilization", protect, getUtilization);
module.exports = router;
