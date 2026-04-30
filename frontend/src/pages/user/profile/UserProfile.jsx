import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getUserStats } from "../../../services/userService";

const UserProfile = () => {
  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getUserStats(user._id);
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!stats) return null;

  return (
    <DashboardLayout>
      <div className="user-profile-container">
        {/* LEFT PROFILE CARD */}
        <div className="user-profile-card">
          <div className="user-profile-avatar">{user.name.charAt(0)}</div>

          <h2 className="user-profile-name">{user.name}</h2>

          <p className="user-profile-email">{user.email}</p>

          <span className="user-profile-badge">User Account</span>

          <div className="user-profile-info">
            <div className="user-profile-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="user-profile-row">
              <span>Account Type</span>
              <strong>Standard User</strong>
            </div>

            <div className="user-profile-row">
              <span>Member Since</span>
              <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
            </div>

            <div className="user-profile-row">
              <span>Registered Vehicle</span>
              <strong>{stats.vehicleNumber}</strong>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="user-profile-right">
          <div className="user-profile-wallet">
            <h3>Wallet Balance</h3>

            <h1>₹{stats.wallet || 0}</h1>

            <p>Available balance</p>

            <button className="user-profile-add-money">+ Add Money</button>
          </div>

          {/* STATISTICS CARD */}
          <div className="user-profile-stats">
            <h3>My Statistics</h3>

            <div className="user-profile-stats-row">
              <span>Total Bookings</span>
              <strong>{stats.totalBookings}</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Completed</span>
              <strong>{stats.completedBookings}</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Active Now</span>
              <strong>{stats.activeBooking ? "1" : "0"}</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Cancelled</span>
              <strong>{stats.cancelledBookings}</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Total Spent</span>
              <strong>₹{stats.totalSpent}</strong>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
