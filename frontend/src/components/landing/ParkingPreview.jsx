import { useState, useEffect } from "react";

const initialSlots = [
  { id: "P01", status: "occupied" },
  { id: "P02", status: "free" },
  { id: "P03", status: "free" },
  { id: "P04", status: "free" },
  { id: "P05", status: "free" },

  { id: "P06", status: "reserved" },
  { id: "P07", status: "free" },
  { id: "P08", status: "occupied" },
  { id: "P09", status: "free" },
  { id: "P10", status: "free" },

  { id: "P11", status: "reserved" },
  { id: "P12", status: "free" },
  { id: "P13", status: "free" },
  { id: "P14", status: "free" },
  { id: "P15", status: "occupied" },
];

const ParkingPreview = () => {
  const [slots, setSlots] = useState(initialSlots);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prev) =>
        prev.map((slot) => {
          const rand = Math.random();

          if (rand < 0.33) return { ...slot, status: "free" };
          if (rand < 0.16) return { ...slot, status: "occupied" };

          return { ...slot, status: "reserved" };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="parking-preview">
      <div className="preview-header">
        Sector A — Live View
        <span className="live-pill">LIVE</span>
      </div>

      <div className="slot-grid">
        {slots.map((slot) => (
          <div key={slot.id} className={`slot ${slot.status}`}>
            {slot.id}
          </div>
        ))}
      </div>

      <div className="legend">
        <span className="dot green" /> Available
        <span className="dot red" /> Occupied
        <span className="dot yellow" /> Reserved
      </div>
    </div>
  );
};

export default ParkingPreview;