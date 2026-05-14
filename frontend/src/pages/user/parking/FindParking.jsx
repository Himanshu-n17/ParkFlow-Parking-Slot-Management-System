import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { UserCard, ParkingSlot } from "../../../components/common/Card";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../../../socket";

import {
  getAllSlots,
  getCurrentBooking,
} from "../../../services/parkingService";
import { UserLoading } from "../../../components/common/Loader";

const FindParking = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [slots, setSlots] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();

    socket.on("slotUpdated", () => {
      console.log("Realtime parking update");

      fetchSlots();
    });

    return () => {
      socket.off("slotUpdated");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const slotsData = await getAllSlots();
      const booking = await getCurrentBooking(user._id);

      setSlots(slotsData);
      setCurrentBooking(booking);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const key = `FLOOR ${slot.floor} - SECTOR ${slot.sector}`;

    if (!acc[key]) acc[key] = [];

    acc[key].push(slot);

    return acc;
  }, {});

  const handleSlotClick = async (slot) => {
    if (slot.status !== "free") {
      toast.error("Slot not available");
      return;
    }

    if (currentBooking) {
      toast.error("You already have an active booking");
      return;
    }

    try {
      navigate(`/user/book-parking/${slot._id}`);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Booking failed");
    }
  };

  const freeCount = slots.filter((s) => s.status === "free").length;
  const occupiedCount = slots.filter((s) => s.status === "occupied").length;
  const bookedCount = slots.filter((s) => s.status === "booked").length;

  if (loading) {
    return <UserLoading />;
  }
  return (
    <DashboardLayout>
      <div className="find-parking-container">
        <div className="parking-header-actions">
          <div className="legend-container">
            <span className="legend-badge">
              <i className="dot free"></i> {freeCount} Free
            </span>

            <span className="legend-badge">
              <i className="dot occupied"></i> {occupiedCount} Occupied
            </span>

            <span className="legend-badge">
              <i className="dot booked"></i> {bookedCount} Booked
            </span>

            {currentBooking && (
              <span className="legend-badge">
                <i className="dot mine"></i> Your booking
              </span>
            )}
          </div>
        </div>

        <UserCard>
          {Object.keys(groupedSlots).map((group) => (
            <div key={group} className="floor-group">
              <h4 className="floor-header">{group}</h4>

              <div className="parking-grid">
                {groupedSlots[group].map((slot) => (
                  <ParkingSlot
                    key={slot._id}
                    id={slot.slotNumber}
                    status={
                      currentBooking && currentBooking.slot._id === slot._id
                        ? "mine"
                        : slot.status
                    }
                    onClick={() => handleSlotClick(slot)}
                  />
                ))}
              </div>
            </div>
          ))}
        </UserCard>
      </div>
    </DashboardLayout>
  );
};

export default FindParking;
