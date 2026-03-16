import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import "../../styles/dashboard.css";
import "../../styles/admin-theme.css";
import "../../styles/user-theme.css";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div
      className={`dashboard ${user?.role === "admin" ? "admin-theme" : "user-theme"}`}
    >
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
