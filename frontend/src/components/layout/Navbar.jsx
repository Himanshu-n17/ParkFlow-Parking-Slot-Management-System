import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useLocation } from "react-router-dom";
import { getUserStats } from "../../services/userService";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getUserStats(user._id);
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!stats) return null;

  const getPageTitle = () => {
    const path = location.pathname;

    // Admin Routes
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/slot-monitor")) return "Slot Monitor";
    if (path.includes("/admin/transactions")) return "Transactions";
    if (path.includes("/admin/anpr-monitor")) return "ANPR Monitoring";
    if (path.includes("/admin/users")) return "All Users";
    if (path.includes("/admin/reports")) return "Reports";

    // User Routes
    if (path.includes("/user/dashboard")) return "Dashboard";
    if (path.includes("/user/find-parking")) return "Find Parking";
    if (path.includes("/user/bookings")) return "My Bookings";
    if (path.includes("/user/profile")) return "My Profile";
  };

  return (
    <div className="navbar">
      <div>
        <h2>{getPageTitle()}</h2>
        <p>Welcome back, {user.name}</p>
      </div>

      <div className="navbar-right">
        <div className="live-pill">LIVE</div>

        {user.role === "user" && (
          <div className="wallet-pill">₹{stats.wallet?.toFixed(2)}</div>
        )}

        <div className="avatar">{user.name?.charAt(0)}</div>
      </div>
    </div>
  );
};

export default Navbar;
