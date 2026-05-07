import React, { useEffect, useState } from "react";
import { getAllUsers, bookSlot, updateUser } from "../../services/adminService";
import { sendOtp, verifyOtp } from "../../services/authService";
import toast from "react-hot-toast";

// Admin Side Booking Slot
export const AdminBookingModal = ({ slot, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser || !vehicleNumber) {
      alert("Fill all fields");
      return;
    }

    try {
      await bookSlot({
        slotId: slot._id,
        userId: selectedUser,
        vehicleNumber,
      });

      onSuccess(); // refresh slots
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal-content">
        <h3>Book Slot {slot.slotNumber}</h3>

        {/* USER DROPDOWN */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} | {u.totalBookings} bookings | ₹{u.totalSpent}
            </option>
          ))}
        </select>

        {/* VEHICLE INPUT */}
        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />

        {/* ACTIONS */}
        <div className="admin-modal-actions">
          <button className="admin-btn primary" onClick={handleSubmit}>
            Confirm Booking
          </button>

          <button className="admin-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Admin add user Modal
export const AddUserModal = ({ open, onClose, refresh }) => {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SEND OTP

  const handleSendOtp = async () => {
    try {
      setLoading(true);

      await sendOtp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user",
      });

      toast.success("OTP sent");

      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      await verifyOtp({
        email: formData.email,
        otp: formData.otp,
      });

      toast.success("User created successfully");

      refresh();

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-user-modal-overlay">
      <div className="admin-user-modal-card">
        {/* CLOSE */}

        <button className="admin-user-modal-close" onClick={onClose}>
          ✕
        </button>

        {/* TITLE */}

        <h2>Add New User</h2>

        <p>Create and verify user account</p>

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="admin-user-modal-input"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="admin-user-modal-input"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="admin-user-modal-input"
            />

            <button
              className="admin-user-modal-btn"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <div className="admin-user-otp-info">
              OTP sent to:
              <span>{formData.email}</span>
            </div>

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="admin-user-modal-input"
            />

            <button
              className="admin-user-modal-btn"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Create User"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const EditUserModal = ({ open, onClose, user, refresh }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    vehicleNumber: user?.vehicleNumber || "",
    password: "",
  });

  if (!open || !user) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateUser(user._id, formData);

      toast.success("User updated successfully");

      refresh();

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-edit-modal-overlay">
      <div className="admin-edit-modal-card">
        <button className="admin-edit-close" onClick={onClose}>
          ✕
        </button>

        <h2>Edit User</h2>

        <p>Update user details & vehicle</p>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="admin-edit-input"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="admin-edit-input"
        />

        <input
          type="text"
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          placeholder="Vehicle Number"
          className="admin-edit-input"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
          className="admin-edit-input"
        />

        <button
          className="admin-edit-save-btn"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
