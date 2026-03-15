const Booking = require("../models/Booking");
const { Parser } = require("json2csv");

// DOWNLOAD BOOKING REPORT
exports.downloadBookingReport = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("slot", "slotNumber floor");

    const reportData = bookings.map((b) => ({
      bookingId: b._id,
      userName: b.user?.name,
      email: b.user?.email,
      vehicleNumber: b.vehicleNumber,
      slotNumber: b.slot?.slotNumber,
      floor: b.slot?.floor,
      entryTime: b.entryTime,
      exitTime: b.exitTime,
      duration: b.duration,
      cost: b.cost,
      paymentStatus: b.paymentStatus,
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(reportData);

    res.header("Content-Type", "text/csv");
    res.attachment("parking_bookings_report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DAILY REVENUE REPORT
exports.downloadRevenueReport = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: "completed",
    });

    const report = bookings.map((b) => ({
      vehicleNumber: b.vehicleNumber,
      entryTime: b.entryTime,
      exitTime: b.exitTime,
      cost: b.cost,
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(report);

    res.header("Content-Type", "text/csv");
    res.attachment("revenue_report.csv");

    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
