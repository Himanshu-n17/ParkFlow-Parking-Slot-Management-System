import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <AuthLayout>
      <h3>Register</h3>

      <div className="role-selector">
        <button
          onClick={() => setRole("user")}
          className={role === "user" ? "active-role" : ""}
        >
          User
        </button>

        <button
          onClick={() => setRole("admin")}
          className={role === "admin" ? "active-role" : ""}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSignup}>
        <input className="auth-input" placeholder="Full Name" />
        <input className="auth-input" placeholder="Email Address" />
        <input className="auth-input" placeholder="Password" />

        {role === "admin" && (
          <input className="auth-input" placeholder="Admin Registration Key" />
        )}

        <button className="auth-button">Register as {role}</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
