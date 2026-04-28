import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const UserProfile = () => {
  return (
    <DashboardLayout>
      <div className="user-profile-container">
        {/* LEFT PROFILE CARD */}

        <div className="user-profile-card">
          <div className="user-profile-avatar">AM</div>

          <h2 className="user-profile-name">Arjun Mehta</h2>

          <p className="user-profile-email">user@parkiq.com</p>

          <span className="user-profile-badge">User Account</span>

          <div className="user-profile-info">
            <div className="user-profile-row">
              <span>Email</span>
              <strong>user@parkiq.com</strong>
            </div>

            <div className="user-profile-row">
              <span>Account Type</span>
              <strong>Standard User</strong>
            </div>

            <div className="user-profile-row">
              <span>Member Since</span>
              <strong>March 2026</strong>
            </div>

            <div className="user-profile-row">
              <span>Registered Vehicle</span>
              <strong>MH12AB4321</strong>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="user-profile-right">
          {/* WALLET CARD */}

          <div className="user-profile-wallet">
            <h3>Wallet Balance</h3>

            <h1>₹2354</h1>

            <p>Available balance</p>

            <button className="user-profile-add-money">+ Add Money</button>
          </div>

          {/* STATISTICS CARD */}

          <div className="user-profile-stats">
            <h3>My Statistics</h3>

            <div className="user-profile-stats-row">
              <span>Total Bookings</span>
              <strong>3</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Completed</span>
              <strong>1</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Active Now</span>
              <strong>1</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Cancelled</span>
              <strong>1</strong>
            </div>

            <div className="user-profile-stats-row">
              <span>Total Spent</span>
              <strong>₹96</strong>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
