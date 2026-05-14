const User = require("../models/User");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const bcrypt = require("bcryptjs");

// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalSlots = await Slot.countDocuments();

    const freeSlots = await Slot.countDocuments({ status: "free" });

    const bookedSlots = await Slot.countDocuments({ status: "booked" });

    const occupiedSlots = await Slot.countDocuments({
      status: "occupied",
    });

    const activeBookings = await Booking.countDocuments({
      status: "active",
    });

    const completedBookings = await Booking.find({
      status: "completed",
    });

    const bookings = await Booking.find({
      $or: [{ status: "completed" }, { status: "cancelled" }],
    });

    let totalRevenue = bookings.reduce((sum, booking) => {
      if (booking.status === "cancelled") {
        return sum + 10;
      }

      return sum + (booking.cost || 0);
    }, 0);

    res.json({
      totalUsers,
      totalSlots,
      freeSlots,
      bookedSlots,
      occupiedSlots,
      activeBookings,
      completedBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RECENT BOOKINGS
exports.getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("slot", "slotNumber floor sector")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlertSlots = async (req, res) => {
  try {
    const alertSlots = await Slot.find({
      status: "alert",
    });

    res.json({
      alerts: alertSlots,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REVENUE ANALYTICS
exports.getRevenueStats = async (req, res) => {
  try {
    const bookings = await Booking.find({
      paymentStatus: "paid",
    });

    let totalRevenue = bookings.reduce((sum, booking) => {
      if (booking.status === "cancelled") {
        return sum + 10; // cancellation fee
      }

      return sum + (booking.cost || 0);
    }, 0);

    const totalBookings = bookings.filter(
      (booking) => booking.status !== "cancelled",
    ).length;

    const avgRevenue = totalBookings === 0 ? 0 : totalRevenue / totalBookings;

    res.json({
      totalRevenue,
      totalBookings,
      avgRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WEEKLY REVENUE
exports.getWeeklyRevenue = async (req, res) => {
  try {
    const days = 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          total: {
            $sum: {
              $cond: [
                { $eq: ["$status", "cancelled"] },
                10, // cancellation fee
                "$cost", // full revenue
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // generate last 7 days properly
    const finalData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const formattedDate = d.toISOString().split("T")[0];

      const dayName = d.toLocaleDateString("en-US", {
        weekday: "short",
      });

      const found = result.find((r) => r._id === formattedDate);

      finalData.push({
        day: dayName,
        revenue: found ? found.total : 0,
      });
    }

    res.json(finalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
};

// PEAK HOURS
exports.getPeakHours = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["active", "completed"] },
        },
      },
      {
        $group: {
          _id: {
            $hour: {
              date: "$entryTime",
              timezone: "Asia/Kolkata",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // convert to full 24h format
    const hours = Array.from({ length: 24 }, (_, i) => {
      const found = result.find((r) => r._id === i);
      return {
        hour: i,
        count: found ? found.count : 0,
      };
    });

    // convert to label (6A, 7A...)
    const formatted = hours.map((h) => {
      const hour = h.hour;
      const label =
        hour === 0
          ? "12A"
          : hour < 12
            ? `${hour}A`
            : hour === 12
              ? "12P"
              : `${hour - 12}P`;
      return {
        time: label,
        value: h.count,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching peak hours" });
  }
};

// Utiliztaion Chart
exports.getUtilization = async (req, res) => {
  try {
    const totalSlots = await Slot.countDocuments();

    const available = await Slot.countDocuments({ status: "free" });
    const occupied = await Slot.countDocuments({ status: "occupied" });
    const reserved = await Slot.countDocuments({ status: "booked" });

    const topSlotData = await Booking.aggregate([
      {
        $group: {
          _id: "$slot",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let topSlot = "N/A";
    let topSlotBookings = 0;

    if (topSlotData.length > 0) {
      const slotDoc = await Slot.findById(topSlotData[0]._id);
      topSlot = slotDoc?.slotNumber || "N/A";
      topSlotBookings = topSlotData[0].count;
    }

    const durationData = await Booking.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);

    const avgDuration = durationData[0]?.avgDuration || 0;

    const totalBookings = await Booking.countDocuments({
      status: "completed",
    });

    const turnover = totalSlots > 0 ? totalBookings / totalSlots : 0;

    const totalRecords = await Booking.countDocuments();
    const validRecords = await Booking.countDocuments({
      entryTime: { $ne: null },
    });

    const accuracy =
      totalRecords > 0 ? ((validRecords / totalRecords) * 100).toFixed(1) : 10;

    res.json({
      totalSlots,
      available,
      occupied,
      reserved,

      topSlot,
      topSlotBookings,

      avgDuration: Number((avgDuration / 3600).toFixed(1)), // convert minutes → hours
      turnover: Number(turnover.toFixed(1)),
      accuracy: Number(accuracy),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching utilization data" });
  }
};

// GET /api/admin/slots
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ slotNumber: 1 });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots" });
  }
};

// POST /api/admin/book
exports.bookSlot = async (req, res) => {
  try {
    const { slotId, userId, vehicleNumber } = req.body;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.status !== "free") {
      return res.status(400).json({ message: "Slot not available" });
    }

    const booking = await Booking.create({
      user: userId,
      slot: slotId,
      vehicleNumber,
      bookingType: "manual",
      status: "active",
      entryTime: new Date(),
      duration: 0, // will update later
    });

    slot.status = "booked";
    slot.currentVehicle = vehicleNumber;

    await slot.save();

    res.json({
      message: "Slot booked successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
};

// PUT /api/admin/cancel/:slotId
exports.cancelBooking = async (req, res) => {
  try {
    const { slotId } = req.params;

    const booking = await Booking.findOne({
      slot: slotId,
      status: "active",
    }).populate("user");

    if (!booking) {
      return res.status(404).json({ message: "No active booking found" });
    }

    // 💰 Refund logic (₹10 cancellation fee)
    const refundAmount = (booking.cost || 0) - 10;

    if (booking.user && refundAmount > 0) {
      await User.findByIdAndUpdate(booking.user._id, {
        $inc: { wallet: refundAmount },
      });
    }

    booking.status = "cancelled";
    booking.exitTime = new Date();

    await booking.save();

    await Slot.findByIdAndUpdate(slotId, {
      status: "free",
      currentVehicle: null,
    });

    res.json({
      message: "Booking cancelled & refund processed",
      refund: refundAmount > 0 ? refundAmount : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};

// PUT /api/admin/free/:slotId
exports.freeSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const booking = await Booking.findOne({
      slot: slotId,
      status: "active",
    });

    if (!booking) {
      return res.status(404).json({ message: "No active booking" });
    }

    booking.status = "completed";
    booking.exitTime = new Date();

    await booking.save();

    await Slot.findByIdAndUpdate(slotId, {
      status: "free",
      currentVehicle: null,
    });

    res.json({
      message: "Slot freed without billing",
    });
  } catch (error) {
    res.status(500).json({ message: "Free slot failed" });
  }
};

exports.getAllUsersWithStats = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          role: "user",
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "user",
          as: "bookings",
        },
      },
      {
        $addFields: {
          totalBookings: { $size: "$bookings" },

          totalSpent: {
            $sum: {
              $map: {
                input: "$bookings",
                as: "b",
                in: {
                  $cond: [
                    { $eq: ["$$b.status", "completed"] },
                    "$$b.cost", // full cost

                    {
                      $cond: [
                        { $eq: ["$$b.status", "cancelled"] },
                        10, // cancellation fee
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          totalBookings: 1,
          totalSpent: 1,
          isBlocked: 1,
        },
      },
    ]);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Booking.find()
      .populate("user", "name email role")
      .populate("slot", "slotNumber")
      .sort({ createdAt: -1 });

    const filtered = transactions.filter(
      (t) => t.user && t.user.role === "user",
    );

    const formatted = filtered.map((t) => {
      let amount = 0;

      if (t.status === "completed") {
        amount = t.cost || 0;
      }

      // ❌ cancelled booking
      else if (t.status === "cancelled") {
        amount = 10;
      }

      return {
        _id: t._id,
        slot: t.slot?.slotNumber || "N/A",
        user: t.user?.name || "Unknown",
        vehicle: t.vehicleNumber,
        entryTime: t.entryTime,
        exitTime: t.exitTime,
        duration: t.duration || 0,
        amount,
        status: t.status,
      };
    });
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, password, vehicleNumber } = req.body;

    const updateData = {
      name,
      email,
      vehicleNumber,
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);

      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    // console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked" : "User unblocked",

      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getFloorUtilization = async (req, res) => {
  try {
    const slots = await Slot.find();

    const grouped = {};

    slots.forEach((slot) => {
      const key = `${slot.floor}-${slot.sector}`;

      if (!grouped[key]) {
        grouped[key] = {
          floor: slot.floor,
          sector: slot.sector,
          total: 0,
          occupied: 0,
        };
      }

      grouped[key].total += 1;

      if (slot.status === "occupied" || slot.status === "booked") {
        grouped[key].occupied += 1;
      }
    });

    const result = Object.values(grouped).map((item) => {
      const percentage = Math.round((item.occupied / item.total) * 100);

      let color = "red";

      if (percentage >= 80) {
        color = "green";
      } else if (percentage >= 60) {
        color = "blue";
      } else if (percentage >= 40) {
        color = "yellow";
      } else {
        color = "red";
      }

      return {
        floor: item.floor,
        sector: item.sector,
        occupied: percentage,
        total: 100,
        color,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching floor utilization",
    });
  }
};
