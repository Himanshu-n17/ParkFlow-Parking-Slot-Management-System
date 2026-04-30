import { Clock, LayoutGrid, Wallet, Activity } from "lucide-react";

export const Card = ({ title, subtitle, children }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3>{title}</h3>

        {subtitle && (
          <span className="dashboard-card-subtitle">{subtitle}</span>
        )}
      </div>

      <div className="dashboard-card-body">{children}</div>
    </div>
  );
};

export const StatCard = ({ title, value, icon, color = "default" }) => {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <h2>{value}</h2>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );
};

export const UserStatCard = ({ icon, value, title, color }) => {
  return (
    <div className={`user-stat-card user-${color}`}>
      <div className="user-stat-icon">{icon}</div>

      <div className="user-stat-content">
        <h2>{value}</h2>
        <p>{title}</p>
      </div>
    </div>
  );
};

export const UserCard = ({ title, action, onActionClick, children }) => {
  return (
    <div className="user-card">
      <div className="user-card-header">
        <h3>{title}</h3>

        {action && (
          <button className="user-card-action" onClick={onActionClick}>
            {action}
          </button>
        )}
      </div>

      <div className="user-card-body">{children}</div>
    </div>
  );
};


//find parking


export const ParkingSlot = ({ id, status, icon }) => {
  const getIcon = () => {
    if (icon === "car") return "🚗";
    if (icon === "diamond") return "✦";
    if (icon === "hourglass") return "⌛";
    return "";
  };

  return (
    <div className={`parking-slot slot-${status}`}>
      <div className="slot-icon">{getIcon()}</div>
      <div className="slot-id">{id}</div>
      <div className="slot-status-label">
        {status === "occupied" ? "In Use" : status === "reserved" ? "Booked" : "Free"}
      </div>
    </div>
  );
};