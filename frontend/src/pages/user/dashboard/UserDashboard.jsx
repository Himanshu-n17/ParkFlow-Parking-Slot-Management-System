import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Clock, LayoutGrid, Wallet, Activity, Search } from "lucide-react";
import { UserStatCard, UserCard } from "../../../components/common/Card";

import {
  getAvailableSlots,
  getBookingHistory,
  getCurrentParking,
  getUserStats,
} from "../../../services/userService";

const UserDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({});
  const [slots, setSlots] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const slotsData = await getAvailableSlots();
      const historyData = await getBookingHistory(user._id);
      const currentData = await getCurrentParking(user._id);
      const statsData = await getUserStats(user._id);

      setSlots(slotsData);
      setHistory(historyData.slice(0, 5));
      setCurrentBooking(currentData);
      setStats(statsData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="user-dashboard">
        <div className="user-stats-grid">
          <UserStatCard
            icon={<Clock size={20} />}
            value={slots.length}
            title="Available Slots"
            color="green"
          />

          <UserStatCard
            icon={<LayoutGrid size={20} />}
            value={stats.totalBookings || 0}
            title="My Bookings"
            color="blue"
          />

          <UserStatCard
            icon={<Wallet size={20} />}
            value={`₹${stats.wallet || 0}`}
            title="Wallet"
            color="purple"
          />

          <UserStatCard
            icon={<Activity size={20} />}
            value={currentBooking ? 1 : 0}
            title="Active Now"
            color="yellow"
          />
        </div>

        <div className="user-banner">
          <div className="user-banner-text">
            <h3>
              {currentBooking
                ? `Currently parked at Slot ${currentBooking.slot.slotNumber}`
                : "No active parking"}
            </h3>

            <p>Browse {slots.length} available slots and book instantly</p>
          </div>

          <button
            className="user-banner-btn"
            onClick={() => navigate("/user/find-parking")}
          >
            Find Parking <Search size={18} />
          </button>
        </div>

        <UserCard
          title="Recent Activity"
          action="View All"
          onActionClick={() => navigate("/user/bookings")}
        >
          <table className="user-table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Vehicle</th>
                <th>Entry</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td className="slot-cell">{item.slot.slotNumber}</td>

                  <td>{item.vehicleNumber}</td>

                  <td>
                    {new Date(item.entryTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="amount-cell">₹{item.cost}</td>

                  <td>
                    <span
                      className={`status-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </UserCard>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
