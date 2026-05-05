import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PeakHourChart from "../../../components/charts/PeakHourChart";
import RevenueChart from "../../../components/charts/RevenueChart";
import UtilizationChart from "../../../components/charts/UtilizationChart";
import { StatCard } from "../../../components/common/Card";
import SystemStatus from "../../../components/SystemStatus";
import {
  getAdminStats,
  getPeakHours,
  getUtilization,
  getWeeklyRevenue,
} from "../../../services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);
  const [peakData, setPeakData] = useState([]);
  const [utilData, setUtilData] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchRevenue();
    fetchPeakHours();
    fetchUtilization();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRevenue = async () => {
    try {
      const data = await getWeeklyRevenue();
      setWeeklyData(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchPeakHours = async () => {
    try {
      const data = await getPeakHours();
      setPeakData(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUtilization = async () => {
    try {
      const data = await getUtilization();
      setUtilData(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ color: "white", padding: "20px" }}>
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="admin-dashboard-grid">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          // trend="up"
          icon="💰"
          color="revenue"
        />
        <StatCard
          title="Available"
          value={stats.freeSlots}
          // trend="up"
          icon="🟢"
          color="available"
        />
        <StatCard
          title="Occupied"
          value={stats.occupiedSlots}
          // trend="down"
          icon="🚗"
          color="occupied"
        />
        <StatCard
          title="Total Bookings"
          value={stats.completedBookings.length}
          // trend="up"
          icon="📊"
          color="booking"
        />

        <div className="weekly-revenue ">
          <RevenueChart data={weeklyData} />
        </div>

        <div className="system-status dashboard-card">
          <SystemStatus
            sensors={`1/${stats.totalSlots} Online`}
            alerts="None"
          />
        </div>

        <div className="peak-hours">
          <PeakHourChart data={peakData} />
        </div>

        <div className="slot-distribution">
          <UtilizationChart
            available={utilData?.available}
            occupied={utilData?.occupied}
            reserved={utilData?.reserved}
            total={utilData?.totalSlots}
            topSlot={utilData?.topSlot}
            topSlotBookings={utilData?.topSlotBookings}
            avgDuration={utilData?.avgDuration}
            turnover={utilData?.turnover}
            accuracy={utilData?.accuracy}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
