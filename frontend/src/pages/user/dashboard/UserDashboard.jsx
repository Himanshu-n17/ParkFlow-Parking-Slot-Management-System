import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Clock, LayoutGrid, Wallet, Activity, Search } from "lucide-react";
import { UserStatCard, UserCard } from "../../../components/common/Card";

const dashboardData = {
  availableSlots: 28,
  bookings: 1,
  wallet: 2450,
  active: 0,
};
const activities = [
  {
    slot: "A1",
    vehicle: "MH12AB1234",
    entry: "08:14 AM",
    amount: 48,
    status: "completed",
  },
  {
    slot: "B3",
    vehicle: "MP09XB5732",
    entry: "09:30 AM",
    amount: 72,
    status: "completed",
  },
];

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="user-dashboard">
        <div className="user-stats-grid">
          <UserStatCard
            icon={<Clock size={20} />}
            value={dashboardData.availableSlots}
            title="Available Slots"
            color="green"
          />

          <UserStatCard
            icon={<LayoutGrid size={20} />}
            value={dashboardData.bookings}
            title="My Bookings"
            color="blue"
          />

          <UserStatCard
            icon={<Wallet size={20} />}
            value={`₹${dashboardData.wallet}`}
            title="Wallet"
            color="purple"
          />

          <UserStatCard
            icon={<Activity size={20} />}
            value={dashboardData.active}
            title="Active Now"
            color="yellow"
          />
        </div>

        <div className="user-banner">
          <div className="user-banner-text">
            <h3>No active parking</h3>

            <p>
              Browse {dashboardData.availableSlots} available slots and book
              instantly
            </p>
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
              {activities.map((item, i) => (
                <tr key={i}>
                  <td className="slot-cell">{item.slot}</td>

                  <td>{item.vehicle}</td>

                  <td>{item.entry}</td>

                  <td className="amount-cell">₹{item.amount}</td>

                  <td>
                    <span className="status-badge">{item.status}</span>
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
