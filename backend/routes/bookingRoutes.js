const express = require("express");
const router = express.Router();

const {
  vehicleEntry,
  vehicleExit,
  getUserBookings,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// vehicle entry (camera or manual)
router.post("/entry", vehicleEntry);

// vehicle exit
router.post("/exit", vehicleExit);

// user booking history
router.get("/user/:userId", protect, getUserBookings);

// admin bookings
router.get("/", protect, adminOnly, getAllBookings);

router.post("/cancel-booking", protect, cancelBooking);

module.exports = router;
