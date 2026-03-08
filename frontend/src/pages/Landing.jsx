import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import "../styles/landing.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <LandingNavbar />

      <HeroSection />
    </div>
  );
};

export default LandingPage;
