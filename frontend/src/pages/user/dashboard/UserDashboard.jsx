import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { UserContext } from "../../../context/userContext";
import API from "../../../services/api";

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    const loadDetections = async () => {
      try {
        const response = await API.get("/anpr/my-detections");
        setDetections(response.data || []);
      } catch {
        setDetections([]);
      }
    };

    loadDetections();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-card" style={{ padding: "1rem" }}>
        <h2>User Dashboard</h2>
        <p>
          <strong>Name:</strong> {user?.name || "-"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "-"}
        </p>
        <p>
          <strong>Role:</strong> {user?.role || "-"}
        </p>
        <p>
          <strong>Vehicle Number:</strong> {user?.vehicleNumber || "-"}
        </p>
        <p>
          <strong>Total ANPR Detections:</strong> {detections.length}
        </p>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
