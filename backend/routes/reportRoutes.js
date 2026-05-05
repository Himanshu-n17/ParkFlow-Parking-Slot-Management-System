const express = require("express");
const router = express.Router();

const {
  downloadBookingReport,
  downloadRevenueReport,
} = require("../controllers/reportController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// booking report
router.get("/bookings", protect, adminOnly, downloadBookingReport);

// revenue report
router.get("/revenue", protect, adminOnly, downloadRevenueReport);

module.exports = router;
