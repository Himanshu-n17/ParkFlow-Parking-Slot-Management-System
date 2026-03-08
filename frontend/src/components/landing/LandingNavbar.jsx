import { useNavigate } from "react-router-dom";

const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-navbar">
      <div className="logo">
        <div className="logo-box">P</div>
        ParkFlow
      </div>

      <div className="nav-buttons">
        <button className="btn-outline" onClick={() => navigate("/login")}>
          Login
        </button>

        <button className="btn-primary" onClick={() => navigate("/login")}>
          Register →
        </button>
      </div>
    </div>
  );
};

export default LandingNavbar;
