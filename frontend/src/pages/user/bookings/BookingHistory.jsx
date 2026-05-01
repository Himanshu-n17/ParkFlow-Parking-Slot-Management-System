import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

import {
  getBookingHistory,
  getCurrentParking,
  cancelBooking,
} from "../../../services/userService";

import toast from "react-hot-toast";

const BookingHistory = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      const history = await getBookingHistory(user._id);
      const active = await getCurrentParking(user._id);

      setBookings(history);
      setActiveBooking(active);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);

      toast.success("Booking cancelled successfully");

      fetchBookings();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Cancel failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="history-page-container">
        {activeBooking ? (
          <div className="active-booking-card">
            <div className="card-content">
              <span className="live-indicator">• ACTIVE BOOKING</span>

              <h1 className="slot-id">Slot {activeBooking.slot.slotNumber}</h1>

              <div className="booking-details-grid">
                <div className="detail-item">
                  <label>VEHICLE</label>
                  <p>{activeBooking.vehicleNumber}</p>
                </div>

                <div className="detail-item">
                  <label>ENTRY</label>
                  <p>
                    {new Date(activeBooking.entryTime).toLocaleTimeString()}
                  </p>
                </div>

                <div className="detail-item">
                  <label>STATUS</label>
                  <p>{activeBooking.status}</p>
                </div>

                <div className="detail-item">
                  <label>COST</label>
                  <p>Running...</p>
                </div>
              </div>
            </div>

            <button
              className="cancel-main-btn"
              onClick={() => handleCancelBooking(activeBooking._id)}
            >
              Cancel Booking
            </button>
          </div>
        ) : (
          <div className="no-active-booking-card">
            <h2>No Active Parking</h2>
            <p>
              You currently don’t have any active parking session. Book a slot
              to get started.
            </p>
            <button
              className="book-parking-btn"
              onClick={() => navigate("/user/find-parking")}
            >
              Book Parking
            </button>
          </div>
        )}

        <div className="history-table-wrapper">
          <div className="table-header-flex">
            <h3>All My Bookings</h3>

            <span className="count-tag">{bookings.length} records</span>
          </div>

          <table className="custom-history-table">
            <thead>
              <tr>
                <th>SLOT</th>
                <th>VEHICLE</th>
                <th>ENTRY</th>
                <th>EXIT</th>
                <th>DURATION</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <span className="slot-pill">{booking.slot.slotNumber}</span>
                  </td>

                  <td className="vehicle-no">{booking.vehicleNumber}</td>

                  <td>{new Date(booking.entryTime).toLocaleTimeString()}</td>

                  <td>
                    {booking.exitTime
                      ? new Date(booking.exitTime).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>
                    {booking.duration
                      ? Math.round(booking.duration / 3600) + " hrs"
                      : "-"}
                  </td>

                  <td className="amount-col">₹{booking.cost || 0}</td>

                  <td>
                    <div className="status-action-cell">
                      <span className={`status-tag ${booking.status}`}>
                        {booking.status.toUpperCase()}
                      </span>

                      {booking.status === "active" && (
                        <button
                          className="cancel-inline-btn"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingHistory;
