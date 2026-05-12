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
    if (path.includes("/user/find-parking-near-me"))
      return "Find Parking Near Me";
    if (path.includes("/user/find-parking")) return "Find Parking";
    if (path.includes("/user/bookings")) return "My Bookings";
    if (path.includes("/user/profile")) return "My Profile";
    if (path.includes("/user/add-money")) return "Add Money";
    if (path.includes("/user/wallet-transactions"))
      return "Wallet Transactions";
  };

  const getPageDescription = () => {
    const path = location.pathname;

    // Admin Routes

    if (path.includes("/admin/dashboard")) return `Welcome back, ${user.name}`;
    if (path.includes("/admin/slot-monitor"))
      return "Manage, monitor and control parking slot activity";
    if (path.includes("/admin/transactions"))
      return "Track all parking payments and booking transactions";
    if (path.includes("/admin/anpr-monitor"))
      return "Monitor AI vehicle recognition and ANPR activity";
    if (path.includes("/admin/users"))
      return "Manage registered users and account access";
    if (path.includes("/admin/reports"))
      return "View analytics, reports and parking insights";

    // User Routes
    if (path.includes("/user/dashboard")) return `Welcome back, ${user.name}`;
    if (path.includes("/user/find-parking-near-me"))
      return "Locate the nearest available smart parking zones";
    if (path.includes("/user/find-parking"))
      return "Browse and reserve available parking slots";
    if (path.includes("/user/bookings"))
      return "View your active and previous parking bookings";
    if (path.includes("/user/profile"))
      return "Manage your profile, wallet and parking details";
    if (path.includes("/user/add-money"))
      return "Securely recharge your ParkFlow wallet";
    if (path.includes("/user/wallet-transactions"))
      return "Track wallet payments, refunds and charges";

    return "Welcome to ParkFlow";
  };
  return (
    <div className="navbar">
      <div>
        <h2>{getPageTitle()}</h2>
        <p>{getPageDescription()}</p>
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
