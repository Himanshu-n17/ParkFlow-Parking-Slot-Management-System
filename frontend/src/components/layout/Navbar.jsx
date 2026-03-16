import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="navbar">
      <div>
        <h2>Dashboard</h2>
        <p>Welcome back, {user.name}</p>
      </div>

      <div className="navbar-right">
        <div className="live-pill">LIVE</div>

        {user.role === "user" && <div className="wallet-pill">₹2450</div>}

        <div className="avatar">{user.name?.charAt(0)}</div>
      </div>
    </div>
  );
};

export default Navbar;
