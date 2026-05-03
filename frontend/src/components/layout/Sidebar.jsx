import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import {
  FiHome,
  FiSearch,
  FiList,
  FiUser,
  FiLogOut,
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiMonitor,
} from "react-icons/fi";
const Sidebar = () => {
  const { user } = useContext(UserContext);

  const isAdmin = user?.role === "admin";

  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="logo-box">P</div>
          <span>ParkFlow</span>
        </div>

        <div className="sidebar-badge">
          {isAdmin ? "Administrator" : "User Portal"}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="sidebar-nav">
        <p className="nav-title">NAVIGATION</p>

        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard">
              <FiGrid />
              Overview
            </NavLink>

            <NavLink to="/admin/slot-monitor">
              <FiMonitor />
              Slot Monitor
            </NavLink>

            <NavLink to="/admin/anpr-monitor">
              <FiMonitor />
              ANPR Monitor
            </NavLink>

            <NavLink to="/admin/transactions">
              <FiList />
              Transactions
            </NavLink>

            <NavLink to="/admin/users">
              <FiUsers />
              Users
            </NavLink>

            <NavLink to="/admin/reports">
              <FiBarChart2 />
              Reports
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/user/dashboard">
              <FiHome />
              Home
            </NavLink>

            <NavLink to="/user/find-parking">
              <FiSearch />
              Find Parking
            </NavLink>
            
            <NavLink to="/user/find-parking-near-me">
              <FiSearch />
              Find Parking Near Me
            </NavLink>

            <NavLink to="/user/bookings">
              <FiList />
              My Bookings
            </NavLink>

            <NavLink to="/user/profile">
              <FiUser />
              Profile
            </NavLink>
          </>
        )}
      </div>

      {/* USER INFO */}

      <div className="sidebar-user">
        <div className="user-info">
          <div className="avatar">{user?.name?.charAt(0) || "A"}</div>

          <div className="user-text">
            <p>{user?.name || "Arjun Mehta"}</p>
            <span>{user?.email || "user@parkiq.com"}</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          <FiLogOut />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
