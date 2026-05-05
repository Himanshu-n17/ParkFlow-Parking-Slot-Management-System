import SlotCard from "./SlotCard";

const groupSlots = (slots) => {
  const grouped = {};

  slots.forEach((slot) => {
    const key = `${slot.floor}-${slot.sector}`;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(slot);
  });

  return grouped;
};

const SlotGrid = ({ slots, refresh }) => {
  const grouped = groupSlots(slots);

  return (
    <div>
      {Object.keys(grouped).map((groupKey) => {
        const [floor, sector] = groupKey.split("-");

        return (
          <div key={groupKey} className="admin-slot-section">
            <h3 className="admin-floor-title">
              FLOOR {floor} — SECTOR {sector}
            </h3>

            <div className="admin-slot-grid">
              {grouped[groupKey].map((slot) => (
                <SlotCard key={slot._id} slot={slot} refresh={refresh} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SlotGrid;
