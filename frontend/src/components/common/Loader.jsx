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
