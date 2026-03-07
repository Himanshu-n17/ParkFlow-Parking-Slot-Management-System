import React, { useState, useContext } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { UserContext } from "../../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/auth.css";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const role = email.includes("admin") ? "admin" : "user";

    const userData = {
      email,
      role,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  return (
    <AuthLayout>
      <div className="auth-tabs">
        <button className="tab active">Sign In</button>
        <Link to="/signup" className="tab">
          Register
        </Link>
      </div>

      <div className="demo-box">
        <p>
          <strong>Demo credentials</strong>
        </p>
        <p>User → user@parkiq.com / user123</p>
        <p>Admin → admin@parkiq.com / admin123</p>
      </div>

      <form onSubmit={handleLogin}>
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

        <button className="auth-button">Sign In →</button>
      </form>

      <p className="auth-footer">
        No account? <Link to="/signup">Register</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
