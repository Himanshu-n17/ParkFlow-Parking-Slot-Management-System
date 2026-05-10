import "../../styles/Loading.css";

export const AdminLoading = () => {
  return (
    <div className="admin-loading-screen">
      <div className="admin-loading-card">
        {/* LOGO */}

        <div className="admin-loading-logo">P</div>

        <h1>ParkFlow Admin</h1>

        <p>Initializing Smart Parking System...</p>

        {/* LOADER */}

        <div className="admin-loading-bar">
          <div className="admin-loading-progress" />
        </div>

        {/* STATUS */}

        <div className="admin-loading-status">
          <span className="pulse-dot" />
          Connecting to sensors...
        </div>
      </div>
    </div>
  );
};

export const UserLoading = () => {
  return (
    <div className="user-loading-screen">
      <div className="user-loading-wrapper">
        <div className="user-loading-logo">🚗</div>

        <h1>ParkFlow</h1>

        <p>Finding the best parking experience for you...</p>

        <div className="user-loading-track">
          <div className="user-loading-bar" />
        </div>

        <div className="user-loading-status">
          <span className="user-loading-dot" />
          Syncing live parking slots...
        </div>
      </div>
    </div>
  );
};
