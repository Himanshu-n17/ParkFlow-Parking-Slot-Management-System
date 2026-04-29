
import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { UserCard, ParkingSlot } from "../../../components/common/Card";

const FindParking = () => {
  const parkingData = [
    {
      title: "FLOOR 1 - SECTOR A",
      slots: [
        { id: "P01", status: "occupied", icon: "car" },
        { id: "P02", status: "free", icon: "diamond" },
        { id: "P03", status: "free", icon: "diamond" },
        { id: "P04", status: "free", icon: "diamond" },
        { id: "P04", status: "free", icon: "diamond" },
        { id: "P05", status: "reserved", icon: "hourglass" },
        { id: "P07", status: "free", icon: "diamond" },
        { id: "P08", status: "occupied", icon: "car" },
        { id: "P09", status: "free", icon: "diamond" },
        { id: "P10", status: "free", icon: "diamond" },
      ],
    },
    {
      title: "FLOOR 2 - SECTOR B",
      slots: [
        { id: "P11", status: "reserved", icon: "hourglass" },
        { id: "P12", status: "free", icon: "diamond" },
        { id: "P13", status: "free", icon: "diamond" },
        { id: "P14", status: "free", icon: "diamond" },
        { id: "P15", status: "occupied", icon: "car" },
        { id: "P16", status: "reserved", icon: "hourglass" },
        { id: "P17", status: "free", icon: "diamond" },
      ],
    },
    {
      title: "FLOOR 3 - SECTOR C",
      slots: [
        { id: "P20", status: "free", icon: "diamond" },
        { id: "P21", status: "free", icon: "diamond" },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="find-parking-container">
        <div className="parking-header-actions">
          <div className="legend-container">
            <span className="legend-badge"><i className="dot free"></i> 28 Free</span>
            <span className="legend-badge"><i className="dot occupied"></i> 6 Occupied</span>
            <span className="legend-badge"><i className="dot reserved"></i> 6 Reserved</span>
            <span className="legend-badge"><i className="dot mine"></i> Your booking</span>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <select className="filter-select">
              <option>All Floors</option>
              <option>Floor 1</option>
              <option>Floor 2</option>
              <option>Floor 3</option>
            </select>
            <select className="filter-select">
              <option>All Status</option>
              <option>Free</option>
              <option>Occupied</option>
            </select>
          </div>
        </div>

        <UserCard>
          {parkingData.map((floor, index) => (
            <div key={index} className="floor-group">
              <h4 className="floor-header">{floor.title}</h4>
              <div className="parking-grid">
                {floor.slots.map((slot, idx) => (
                  <ParkingSlot 
                    key={idx} 
                    id={slot.id} 
                    status={slot.status} 
                    icon={slot.icon}
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