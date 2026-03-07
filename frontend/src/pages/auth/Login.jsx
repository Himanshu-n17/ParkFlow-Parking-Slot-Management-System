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
      <h3>Sign In</h3>

      <form onSubmit={handleLogin}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button">Sign In →</button>
      </form>

      <p style={{ marginTop: "15px" }}>
        No account? <Link to="/signup">Register</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
