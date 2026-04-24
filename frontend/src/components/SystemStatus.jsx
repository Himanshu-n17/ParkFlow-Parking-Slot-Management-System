import "./SystemStatus.css";

const SystemStatus = ({
  core = "Operational",
  sensors = "40/40 Online",
  cctv = "All Active",
  latency = "12ms",
  lastSync = "Just now",
  alerts = "None",
}) => {
  return (
    <div className="system-status-card">
      {/* Header */}

      <div className="status-header">
        <h3>System Status</h3>

        <span className="live-badge">LIVE</span>
      </div>

      {/* Status List */}

      <div className="status-list">
        <StatusRow label="Core System" value={core} success />

        <StatusRow label="Sensors" value={sensors} success />

        <StatusRow label="CCTV Feed" value={cctv} success />

        <StatusRow label="Avg Latency" value={latency} />

        <StatusRow label="Last Sync" value={lastSync} />

        <StatusRow label="Alerts" value={alerts} success />
      </div>
    </div>
  );
};

export default SystemStatus;

/* reusable row */

const StatusRow = ({ label, value, success }) => {
  return (
    <div className="status-row">
      <span className="status-label">{label}</span>

      <span className={`status-value ${success ? "status-success" : ""}`}>
        {value}
      </span>
    </div>
  );
};
