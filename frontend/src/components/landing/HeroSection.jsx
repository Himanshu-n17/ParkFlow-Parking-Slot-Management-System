import { useNavigate } from "react-router-dom";
import ParkingPreview from "./ParkingPreview.jsx";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-left">
        <div className="hero-badge">Smart City Infrastructure Platform</div>
        
        <h1>
          Smart Parking <br />
          Made Easy
        </h1>

        <p>
          Real-time slot detection, online booking, and automated billing — one
          intelligent platform for modern cities.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Get Started →
          </button>

          <button className="btn-outline" onClick={() => navigate("/login")}>
            View Demo
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <h3>500+</h3>
            <p>Parking Slots</p>
          </div>

          <div>
            <h3>98%</h3>
            <p>Uptime SLA</p>
          </div>

          <div>
            <h3>24/7</h3>
            <p>Monitoring</p>
          </div>
        </div>
      </div>

      <ParkingPreview />
    </div>
  );
};

export default HeroSection;
