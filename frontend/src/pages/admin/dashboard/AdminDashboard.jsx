import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PeakHourChart from "../../../components/charts/PeakHourChart";
import RevenueChart from "../../../components/charts/RevenueChart";
import UtilizationChart from "../../../components/charts/UtilizationChart";
import { StatCard } from "../../../components/common/Card";
import SystemStatus from "../../../components/SystemStatus";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="admin-dashboard-grid">
        
        <StatCard
          title="Total Revenue"
          value="₹540"
          trend="up"
          icon="💰"
          color="revenue"
        />
        <StatCard
          title="Available"
          value="27"
          trend="up"
          icon="🟢"
          color="available"
        />
        <StatCard
          title="Occupied"
          value="6"
          trend="down"
          icon="🚗"
          color="occupied"
        />
        <StatCard
          title="Total Bookings"
          value="10"
          trend="up"
          icon="📊"
          color="booking"
        />

        <div className="weekly-revenue ">
          <RevenueChart />
        </div>

        <div className="system-status dashboard-card">
          <SystemStatus />
        </div>

        <div className="peak-hours">
          <PeakHourChart />
        </div>

        <div className="slot-distribution">
          <UtilizationChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
