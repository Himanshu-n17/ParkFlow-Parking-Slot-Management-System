import { useState } from "react";
import { cancelBooking, freeSlot } from "../../services/adminService";
import { AdminBookingModal } from "../../components/common/AdminModal";

const SlotCard = ({ slot, refresh }) => {
  const [showModal, setShowModal] = useState(false);

  const getClass = () => {
    let base = "admin-slot-card";

    if (slot.status === "free") return `${base} admin-slot-free`;
    if (slot.status === "occupied") return `${base} admin-slot-occupied`;
    if (slot.status === "booked") return `${base} admin-slot-reserved`;

    return base;
  };

  const handleClick = async () => {
    try {
      // 🟢 FREE → open modal
      if (slot.status === "free") {
        setShowModal(true);
        return;
      }

      // 🟡 BOOKED → cancel
      if (slot.status === "booked") {
        const confirmAction = window.confirm(
          `Cancel booking for ${slot.slotNumber}?`,
        );
        if (!confirmAction) return;

        await cancelBooking(slot._id);
      }

      // 🔴 OCCUPIED → free
      if (slot.status === "occupied") {
        const confirmAction = window.confirm(`Free slot ${slot.slotNumber}?`);
        if (!confirmAction) return;

        await freeSlot(slot._id);
      }

      refresh();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  return (
    <>
      <div className={getClass()} onClick={handleClick}>
        <h4>{slot.slotNumber}</h4>

        <p>
          {slot.status === "free" && "FREE"}
          {slot.status === "booked" && "BOOKED"}
          {slot.status === "occupied" && "IN USE"}
        </p>
      </div>

      {/* 🔥 Booking Modal */}
      {showModal && (
        <AdminBookingModal
          slot={slot}
          onClose={() => setShowModal(false)}
          onSuccess={refresh}
        />
      )}
    </>
  );
};

export default SlotCard;
