const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getRecentBookings,
  getRevenueStats,
  getAlertSlots,
  getWeeklyRevenue,
  getPeakHours,
  getUtilization,
  getAllSlots,
  bookSlot,
  cancelBooking,
  freeSlot,
  getAllUsersWithStats,
  getAllTransactions,
  updateUser,
  toggleBlockUser,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// dashboard summary
router.get("/stats", protect, adminOnly, getDashboardStats);

// recent bookings
router.get("/recent-bookings", protect, adminOnly, getRecentBookings);

// revenue analytics
router.get("/revenue", protect, adminOnly, getRevenueStats);

router.get("/alerts", protect, adminOnly, getAlertSlots);

router.get("/revenue-weekly", protect, adminOnly, getWeeklyRevenue);

router.get("/peak-hours", protect, adminOnly, getPeakHours);

router.get("/utilization", protect, adminOnly, getUtilization);

router.get("/slots", protect, adminOnly, getAllSlots);
router.post("/book", protect, adminOnly, bookSlot);
router.put("/cancel/:slotId", protect, adminOnly, cancelBooking);
router.put("/free/:slotId", protect, adminOnly, freeSlot);
router.get("/users", protect, adminOnly, getAllUsersWithStats);

router.get("/transactions", protect, adminOnly, getAllTransactions);

router.put("/users/:id", protect, adminOnly, updateUser);

router.put("/users/block/:id", protect, adminOnly, toggleBlockUser);
module.exports = router;
