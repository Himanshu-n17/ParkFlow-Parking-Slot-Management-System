import React, { useEffect, useState } from "react";
import { getAllUsers, bookSlot } from "../../services/adminService";

const AdminBookingModal = ({ slot, onClose, onSuccess }) => {
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

export default AdminBookingModal;
