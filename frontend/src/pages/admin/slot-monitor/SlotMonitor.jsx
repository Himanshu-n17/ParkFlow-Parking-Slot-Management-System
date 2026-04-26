import React, { useContext, useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";

const SlotMonitor = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const scanningRef = useRef(false);
  const redirectedRef = useRef(false);

  const [status, setStatus] = useState("Click Start ANPR to begin");
  const [plate, setPlate] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [lastScanAt, setLastScanAt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [savedDetections, setSavedDetections] = useState([]);

  const captureAndDetect = async () => {
    if (scanningRef.current) return;
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.readyState < 2) return;

    scanningRef.current = true;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const image = canvas.toDataURL("image/jpeg", 0.8);
      const response = await API.post("/anpr/detect", { image });
      const result = response.data;

      if (result.detected && result.plate) {
        setPlate(result.plate);
        setConfidence(result.confidence || 0);
        setStatus(result.saved ? "Plate detected and saved" : "Plate detected");
        setSavedDetections((prev) => [
          {
            _id: result.detectionId || `${Date.now()}`,
            plate: result.plate,
            confidence: result.confidence || 0,
            createdAt: result.timestamp,
          },
          ...prev,
        ].slice(0, 20));

        if (!redirectedRef.current) {
          redirectedRef.current = true;
          const profilePath =
            user?.role === "admin" ? "/admin/profile" : "/user/profile";
          setTimeout(() => {
            navigate(profilePath);
          }, 700);
        }
      } else {
        setStatus("Scanning...");
      }

      setLastScanAt(new Date().toLocaleTimeString());
    } catch (error) {
      const apiMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Detection error";
      setStatus(`Detection error: ${apiMessage}`);
    } finally {
      scanningRef.current = false;
    }
  };

  const loadMyDetections = async () => {
    try {
      const response = await API.get("/anpr/my-detections");
      setSavedDetections(response.data || []);
    } catch {
      // Ignore history fetch failures so live scanning still works.
    }
  };

  const stopMonitoring = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRunning(false);
    setStatus("ANPR stopped");
  };

  const startMonitoring = async () => {
    if (isRunning) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsRunning(true);
      setStatus("Camera running - scanning...");
      loadMyDetections();
      timerRef.current = setInterval(captureAndDetect, 1800);
    } catch {
      setStatus("Camera permission denied or unavailable");
    }
  };

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-card" style={{ padding: "1rem" }}>
        <h2>Automatic ANPR Monitor</h2>
        <p style={{ margin: "0.5rem 0 1rem" }}>{status}</p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1rem",
            padding: "0.75rem",
            border: "2px solid #16a34a",
            borderRadius: "10px",
            background: "#f0fdf4",
            width: "fit-content",
          }}
        >
          <button
            onClick={startMonitoring}
            disabled={isRunning}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: "1px solid #166534",
              background: isRunning ? "#86efac" : "#16a34a",
              color: "#fff",
              cursor: isRunning ? "not-allowed" : "pointer",
            }}
          >
            {isRunning ? "ANPR Running" : "Start ANPR"}
          </button>
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            maxWidth: "760px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fff",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Detected Plate:</strong> {plate || "No plate yet"}
          </p>
          <p>
            <strong>Confidence:</strong> {confidence ? `${confidence}%` : "-"}
          </p>
          <p>
            <strong>Last Scan:</strong> {lastScanAt || "-"}
          </p>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Saved Detections (current login):</strong>
          </p>
          {savedDetections.length === 0 ? (
            <p>No saved detections yet.</p>
          ) : (
            <ul style={{ paddingLeft: "1rem" }}>
              {savedDetections.map((item) => (
                <li key={item._id}>
                  {item.plate} ({Number(item.confidence || 0).toFixed(1)}%) -{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SlotMonitor;