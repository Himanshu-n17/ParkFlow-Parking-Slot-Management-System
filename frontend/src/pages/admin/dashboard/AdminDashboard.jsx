import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PeakHourChart from "../../../components/charts/PeakHourChart";
import RevenueChart from "../../../components/charts/RevenueChart";
import UtilizationChart from "../../../components/charts/UtilizationChart";
import { StatCard } from "../../../components/common/Card";
import SystemStatus from "../../../components/SystemStatus";
import { getAdminStats } from "../../../services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
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
          <RevenueChart />
        </div>

        <div className="system-status dashboard-card">
          <SystemStatus
            sensors={`1/${stats.totalSlots} Online`}
            alerts="None"
          />
        </div>

        <div className="peak-hours">
          <PeakHourChart />
        </div>

        <div className="slot-distribution">
          <UtilizationChart
            available={stats.freeSlots}
            occupied={stats.occupiedSlots}
            reserved={stats.bookedSlots}
            total={stats.totalSlots}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
