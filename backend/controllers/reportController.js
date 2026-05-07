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
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("slot", "slotNumber")
      .sort({ createdAt: -1 });

    const report = bookings.map((b) => {
      // cancelled booking fee
      const amount = b.status === "cancelled" ? 10 : b.cost || 0;

      // duration in hours
      const durationHours = b.duration ? (b.duration / 3600).toFixed(2) : 0;

      return {
        BookingID: b._id,

        User: b.user?.name || "N/A",

        Email: b.user?.email || "N/A",

        Slot: b.slot?.slotNumber || "N/A",

        Vehicle: b.vehicleNumber,

        Status: b.status.toUpperCase(),

        EntryTime: b.entryTime ? new Date(b.entryTime).toLocaleString() : "-",

        ExitTime: b.exitTime ? new Date(b.exitTime).toLocaleString() : "-",

        DurationHours: durationHours,

        Amount: `Rs ${amount}`,

        PaymentStatus: b.paymentStatus || "pending",
      };
    });

    const fields = [
      "BookingID",
      "User",
      "Email",
      "Slot",
      "Vehicle",
      "Status",
      "EntryTime",
      "ExitTime",
      "DurationHours",
      "Amount",
      "PaymentStatus",
    ];

    const json2csv = new Parser({ fields });

    const csv = json2csv.parse(report);

    res.header("Content-Type", "text/csv");

    res.attachment(`transaction_report_${Date.now()}.csv`);

    res.send(csv);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
