import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { UserContext } from "../../../context/userContext";
import API from "../../../services/api";

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === "admin";
  const [detections, setDetections] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      setDetections([]);
      return;
    }

    const loadDetections = async () => {
      try {
        const response = await API.get("/anpr/my-detections");
        setDetections(response.data || []);
      } catch {
        setDetections([]);
      }
    };

    loadDetections();
  }, [isAdmin]);

  return (
    <DashboardLayout>
      <div
        className="dashboard-card"
        style={{ padding: "1.25rem", background: "#ffffff", color: "#111827" }}
      >
        <h2>User Profile Details</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "0.75rem" }}>
            <strong>Name:</strong> {user?.name || "-"}
          </div>
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "0.75rem" }}>
            <strong>Email:</strong> {user?.email || "-"}
          </div>
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "0.75rem" }}>
            <strong>Role:</strong> {user?.role || "-"}
          </div>
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "0.75rem" }}>
            <strong>Vehicle Number:</strong> {user?.vehicleNumber || "-"}
          </div>
          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "0.75rem" }}>
            <strong>Wallet:</strong> {user?.wallet ?? 0}
          </div>
        </div>

        {isAdmin && (
          <div style={{ marginTop: "1rem" }}>
            <h3>ANPR Detections</h3>
            {detections.length === 0 ? (
              <p>No detections found.</p>
            ) : (
              <div
                style={{
                  marginTop: "0.5rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#f3f4f6" }}>
                    <tr>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>Plate</th>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>Confidence</th>
                      <th style={{ textAlign: "left", padding: "0.75rem" }}>Detected At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detections.map((item, index) => (
                      <tr
                        key={item._id}
                        style={{ background: index % 2 === 0 ? "#ffffff" : "#f9fafb" }}
                      >
                        <td style={{ padding: "0.75rem", borderTop: "1px solid #f3f4f6" }}>
                          {item.plate}
                        </td>
                        <td style={{ padding: "0.75rem", borderTop: "1px solid #f3f4f6" }}>
                          {Number(item.confidence || 0).toFixed(1)}%
                        </td>
                        <td style={{ padding: "0.75rem", borderTop: "1px solid #f3f4f6" }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
