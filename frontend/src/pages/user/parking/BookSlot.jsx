import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { bookSlot } from "../../../services/parkingService";
import toast from "react-hot-toast";

const BookSlot = () => {
  const { slotId } = useParams();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: user?.vehicleNumber || "",
    duration: 1,
  });

  /* CONVERT HOURS → HH:MM:SS */

  const convertDurationToHHMMSS = (hours) => {
    return `${String(hours).padStart(2, "0")}:00:00`;
  };

  /* BOOK SLOT HANDLER */

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.vehicleNumber) {
      toast.error("Vehicle number required");
      return;
    }

    try {
      setLoading(true);

      const formattedDuration = convertDurationToHHMMSS(formData.duration);

      await bookSlot({
        slotId,
        userId: user._id,
        vehicleNumber: formData.vehicleNumber,
        duration: formattedDuration,
      });

      toast.success("Slot booked successfully 🚗");

      navigate("/user/bookings");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="book-slot-overlay">
        <div className="book-slot-modal">
          {/* HEADER */}

          <div className="modal-header">
            <h2>Book Parking Slot</h2>

            <button onClick={() => navigate(-1)} className="close-btn">
              &times;
            </button>
          </div>

          <p className="modal-subtitle">Complete your reservation</p>

          {/* SLOT INFO */}

          <div className="slot-badge">
            <span className="p-icon">P</span>

            <span>Slot ID — {slotId}</span>
          </div>

          {/* FORM */}

          <form onSubmit={handleBooking}>
            {/* VEHICLE NUMBER */}

            <div className="form-group">
              <label>Vehicle Number</label>

              <input
                type="text"
                className="form-input"
                placeholder="MH12AB4321"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleNumber: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>

            {/* DURATION SELECT */}

            <div className="form-group">
              <label>Duration</label>

              <select
                className="form-select"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
              >
                {[1, 2, 3, 4, 5, 8].map((hr) => (
                  <option key={hr} value={hr}>
                    {hr} {hr === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
            </div>

            {/* COST NOTE */}

            <div className="price-box">
              Parking charges will be calculated automatically based on usage
              duration
            </div>

            {/* BUTTONS */}

            <div className="button-group">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button type="submit" className="btn-confirm" disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking ✓"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookSlot;
