import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import SlotGrid from "../../../components/parking/SlotGrid";
import {
  getAllSlots,
  createSlot,
  deleteSlot,
} from "../../../services/adminService";
import { AdminLoading } from "../../../components/common/Loader";
import socket from "../../../socket";

const SlotMonitor = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newSlot, setNewSlot] = useState({
    slotNumber: "",
    floor: "",
    sector: "",
    sensorId: "",
  });
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    fetchSlots();

    socket.on("slotUpdated", () => {
      console.log("Real-time slot update received");

      fetchSlots();
    });

    return () => {
      socket.off("slotUpdated");
    };
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getAllSlots();
      setSlots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createSlot(newSlot);
      setShowCreate(false);
      setNewSlot({
        slotNumber: "",
        floor: "",
        sector: "",
        sensorId: "",
      });
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const handleDelete = async () => {
    if (!selectedSlot) return;

    const confirmDelete = window.confirm("Delete this slot?");
    if (!confirmDelete) return;

    try {
      await deleteSlot(selectedSlot);
      setShowDelete(false);
      setSelectedSlot("");
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <AdminLoading />;
  }
  return (
    <DashboardLayout>
      <div className="admin-slot-monitor-container">
        <div className="admin-slot-actions">
          <button
            className="admin-btn primary"
            onClick={() => setShowCreate(true)}
          >
            + Create Slot
          </button>

          <button
            className="admin-btn danger"
            onClick={() => setShowDelete(true)}
          >
            Delete Slot
          </button>
        </div>

        <SlotGrid slots={slots} refresh={fetchSlots} />

        {showCreate && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <h3>Create Slot</h3>

              <input
                placeholder="Slot Number"
                value={newSlot.slotNumber}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, slotNumber: e.target.value })
                }
              />

              <input
                placeholder="Floor"
                value={newSlot.floor}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, floor: e.target.value })
                }
              />

              <input
                placeholder="Sector"
                value={newSlot.sector}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, sector: e.target.value })
                }
              />

              <input
                placeholder="Sensor ID"
                value={newSlot.sensorId}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, sensorId: e.target.value })
                }
              />

              <div className="admin-modal-actions">
                <button onClick={handleCreate} className="admin-btn primary">
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="admin-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDelete && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <h3>Delete Slot</h3>

              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select Slot</option>
                {slots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.slotNumber} ({slot.floor}-{slot.sector})
                  </option>
                ))}
              </select>

              <div className="admin-modal-actions">
                <button onClick={handleDelete} className="admin-btn danger">
                  Delete
                </button>
                <button
                  onClick={() => setShowDelete(false)}
                  className="admin-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SlotMonitor;
