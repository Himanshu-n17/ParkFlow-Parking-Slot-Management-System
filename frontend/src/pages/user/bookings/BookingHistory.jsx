import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const BookingHistory = () => {
  const bookings = [
    {
      id: 1,
      slot: "P02",
      vehicle: "MH12AB4321",
      entry: "09:04 pm",
      exit: "11:04 pm",
      hrs: 2,
      amount: 48,
      status: "active",
    },
    {
      id: 2,
      slot: "P02",
      vehicle: "MH12AB4321",
      entry: "09:03 pm",
      exit: "11:03 pm",
      hrs: 2,
      amount: 48,
      status: "cancelled",
    },
    {
      id: 3,
      slot: "P03",
      vehicle: "MH12AB1234",
      entry: "08:14 am",
      exit: "10:32 am",
      hrs: 2,
      amount: 48,
      status: "completed",
    },
  ];

  const activeBooking = bookings.find((b) => b.status === "active");

  return (
    <DashboardLayout>
      <div className="history-page-container">
        <h2 className="page-main-title">USER BOOKING HISTORY</h2>

        {activeBooking && (
          <div className="active-booking-card">
            <div className="card-content">
              <span className="live-indicator">• ACTIVE BOOKING</span>
              <h1 className="slot-id">Slot {activeBooking.slot}</h1>
              <div className="booking-details-grid">
                <div className="detail-item">
                  <label>VEHICLE</label>
                  <p>{activeBooking.vehicle}</p>
                </div>
                <div className="detail-item">
                  <label>ENTRY</label>
                  <p>{activeBooking.entry}</p>
                </div>
                <div className="detail-item">
                  <label>EXIT</label>
                  <p>{activeBooking.exit}</p>
                </div>
                <div className="detail-item">
                  <label>COST</label>
                  <p>₹{activeBooking.amount}</p>
                </div>
              </div>
            </div>
            <button className="cancel-main-btn">Cancel</button>
          </div>
        )}

        {/* Bookings Table Section */}
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
                <th>HRS</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <span className="slot-pill">{booking.slot}</span>
                  </td>
                  <td className="vehicle-no">{booking.vehicle}</td>
                  <td>{booking.entry}</td>
                  <td>{booking.exit}</td>
                  <td>{booking.hrs}</td>
                  <td className="amount-col">₹{booking.amount}</td>
                  <td>
                    <div className="status-action-cell">
                      <span className={`status-tag ${booking.status}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      {booking.status === "active" && (
                        <button className="cancel-inline-btn">Cancel</button>
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
