import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import RevenueChart from "../../../components/charts/RevenueChart";
import UtilizationChart from "../../../components/charts/UtilizationChart";
import FloorUtilization from "../../../components/charts/FloorUtilization";

import {
  getAdminStats,
  getWeeklyRevenue,
  getUtilization,
  getFloorUtilization,
} from "../../../services/adminService";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [utilData, setUtilData] = useState(null);
  const [floorData, setFloorData] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, revenueData, utilizationData] = await Promise.all([
        getAdminStats(),
        getWeeklyRevenue(),
        getUtilization(),
      ]);
      const floor = await getFloorUtilization();

      setFloorData(floor);

      setStats(statsData);
      setWeeklyData(revenueData);
      setUtilData(utilizationData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-reports-page">
        <div className="admin-reports-header">
          <p>Admin: System Analytics • {new Date().toLocaleDateString()}</p>
        </div>

        <div className="admin-report-cards-grid">
          <div className="admin-report-card">
            <div className="admin-report-icon trophy">🏆</div>

            <h2>{utilData?.topSlot || "P07"}</h2>

            <h4>Most Used Slot</h4>

            <p>{utilData?.topSlotBookings || 0} bookings till now</p>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon duration">⏱</div>

            <h2>{utilData?.avgDuration || 0}h</h2>

            <h4>Avg Duration</h4>

            <p>Per booking</p>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon turnover">🔄</div>

            <h2>{utilData?.turnover || 0}x</h2>

            <h4>Avg Turnover</h4>

            <p>Per slot/day</p>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon revenue">💎</div>

            <h2>
              ₹
              {Math.round(
                (stats?.totalRevenue || 0) / (utilData?.totalSlots || 1),
              )}
            </h2>

            <h4>Revenue / Slot</h4>

            <p>Average daily</p>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon accuracy">📡</div>

            <h2>{utilData?.accuracy || 99.8}%</h2>

            <h4>Sensor Accuracy</h4>

            <p>Detection rate</p>
          </div>

          <div className="admin-report-card">
            <div className="admin-report-icon bookings">🚗</div>

            <h2>{stats?.completedBookings?.length || 0}</h2>

            <h4>Total Completed</h4>

            <p>Parking sessions</p>
          </div>
        </div>

        <div className="admin-reports-bottom-grid">
          <div className="admin-report-chart-card ">
            <FloorUtilization data={floorData} />
          </div>

          <div className="admin-report-chart-card ">
            <RevenueChart data={weeklyData} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
