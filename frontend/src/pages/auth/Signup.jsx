import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      role,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    navigate("/login");
  };

  return (
    <AuthLayout>
      
      {/* Tabs */}
      <div className="auth-tabs">
        <Link to="/login" className="tab">
          Sign In
        </Link>
        <button className="tab active">Register</button>
      </div>

      {/* Role Selection */}
      <div className="role-selector">
        <div
          className={`role-card ${role === "user" ? "active-role" : ""}`}
          onClick={() => setRole("user")}
        >
          <h4>User</h4>
          <p>Book & manage slots</p>
        </div>

        <div
          className={`role-card ${role === "admin" ? "active-role" : ""}`}
          onClick={() => setRole("admin")}
        >
          <h4>Admin</h4>
          <p>Manage the system</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup}>
        <input
          className="auth-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {role === "admin" && (
          <input
            className="auth-input"
            type="password"
            placeholder="Admin Registration Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            required
          />
        )}

        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-button">
          Register as {role === "admin" ? "Admin" : "User"} →
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
