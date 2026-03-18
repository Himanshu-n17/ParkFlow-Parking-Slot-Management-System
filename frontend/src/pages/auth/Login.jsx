import React, { useState, useContext } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { UserContext } from "../../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/auth.css";
import { loginUser } from "../../services/authService";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      toast.success("Login successful 🚀");

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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

      <form onSubmit={handleLogin}>
        <input
          className={`auth-input ${errors.email ? "input-error" : ""}`}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <div className="password-field">
          <input
            className={`auth-input ${errors.password ? "input-error" : ""}`}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button className="auth-button">
          {loading ? "Signing in..." : "Sign In →"}
        </button>
      </form>

      <p className="auth-footer">
        No account? <Link to="/signup">Register</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
