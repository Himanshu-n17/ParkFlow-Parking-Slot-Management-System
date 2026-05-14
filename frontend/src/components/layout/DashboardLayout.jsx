import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/userContext";
import socket from "../../socket";
import "../../styles/dashboard.css";
import "../../styles/admin-theme.css";
import "../../styles/user-theme.css";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  const [alertData, setAlertData] = useState(null);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (user?.role !== "admin") return;

    audioRef.current = new Audio("/alert.mp3");

    audioRef.current.loop = true;

    const handleUnauthorized = (data) => {
      console.log("🚨 ALERT RECEIVED FRONTEND", data);

      setAlertData(data);

      if (!muted && audioRef.current) {
        audioRef.current
          .play()
          .catch((err) => console.log("Audio blocked:", err));
      }
    };

    socket.on("unauthorizedParking", handleUnauthorized);

    return () => {
      socket.off("unauthorizedParking", handleUnauthorized);

      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, [user]);

  const closeAlert = () => {
    setAlertData(null);

    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setMuted(!muted);

    if (audioRef.current) {
      if (!muted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div
      className={`dashboard ${
        user?.role === "admin" ? "admin-theme" : "user-theme"
      }`}
    >
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        {alertData && user?.role === "admin" && (
          <div className="unauthorized-alert-box">
            <div className="unauthorized-alert-top">
              <h2>🚨 Unauthorized Parking</h2>

              <button onClick={closeAlert}>✕</button>
            </div>

            <div className="unauthorized-alert-body">
              <p>
                <strong>Slot:</strong> {alertData.slotNumber}
              </p>

              <p>
                <strong>Floor:</strong> {alertData.floor}
              </p>

              <p>
                <strong>Sector:</strong> {alertData.sector}
              </p>

              <p>Vehicle detected without booking.</p>
            </div>

            <button className="mute-alert-btn" onClick={toggleMute}>
              {muted ? "🔊 Unmute Alarm" : "🔇 Mute Alarm"}
            </button>
          </div>
        )}

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
