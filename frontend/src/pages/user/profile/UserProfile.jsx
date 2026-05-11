import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getUserStats, updateProfile } from "../../../services/userService";
import { UserLoading } from "../../../components/common/Loader";
import { FiEdit2, FiEye, FiEyeOff } from "react-icons/fi";

const UserProfile = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    vehicleNumber: user.vehicleNumber || "",
    password: "",
  });

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getUserStats(user._id);
      setStats(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdateProfile = async () => {
    try {
      await updateProfile(formData);
      const updatedUser = {
        ...user,
        ...formData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated");
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  if (loading) {
    return <UserLoading />;
  }
  if (!stats) return null;

  return (
    <DashboardLayout>
      <div className="user-profile-container">
        {/* LEFT PROFILE CARD */}
        <div className="user-profile-card">
          <button
            className="user-profile-edit-btn"
            onClick={() => setShowEditModal(true)}
          >
            <FiEdit2 />
          </button>
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
      {showEditModal && (
        <div className="user-profile-modal-overlay">
          <div className="user-profile-modal">
            <div className="user-profile-modal-top">
              <div className="user-profile-modal-icon">✏️</div>

              <div>
                <h2>Edit Profile</h2>
                <p>Update your account information</p>
              </div>
            </div>

            <div className="user-profile-input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="user-profile-input-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="user-profile-input-group">
              <label>Vehicle Number</label>

              <input
                type="text"
                name="vehicleNumber"
                placeholder="MP09AB1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
              />
            </div>

            <div className="user-profile-input-group">
              <label>New Password</label>

              <div className="user-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="user-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="user-profile-modal-actions">
              <button
                className="user-profile-cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>

              <button
                className="user-profile-save-btn"
                onClick={handleUpdateProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserProfile;
