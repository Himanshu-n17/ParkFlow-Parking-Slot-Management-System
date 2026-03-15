const express = require("express");
const router = express.Router();

const {
  downloadBookingReport,
  downloadRevenueReport,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

// booking report
router.get("/bookings", protect, downloadBookingReport);

// revenue report
router.get("/revenue", protect, downloadRevenueReport);

module.exports = router;
