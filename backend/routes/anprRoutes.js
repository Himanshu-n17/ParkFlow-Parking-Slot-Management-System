const express = require("express");
const router = express.Router();

const {
  detectNumberPlate,
  getMyDetections,
} = require("../controllers/anprController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/detect", protect, adminOnly, detectNumberPlate);
router.get("/my-detections", protect, adminOnly, getMyDetections);

module.exports = router;
